"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Authentication credentials
const ADMIN_CREDENTIALS = {
  username: "lilyaartshop",
  password: "Lilya!!94"
};

function verifyAdminCredentials(username: string, password: string): boolean {
  return username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password;
}

interface ConfigData {
  shopify: {
    storeDomain: string;
    storefrontAccessToken: string;
    webhookSecret: string;
    revalidationSecret: string;
    publicUrl: string;
    adminAccessToken: string;
    clientId: string;
    clientSecret: string;
  };
  site: {
    companyName: string;
    siteName: string;
  };
  notifications: {
    enableEmail: boolean;
    enableWhatsApp: boolean;
    adminEmail: string;
    customMessage: string;
  };
  emailService: {
    provider: string;
    apiKey: string;
    fromEmail: string;
    fromName: string;
  };
  whatsappService: {
    provider: string;
    apiKey: string;
    phoneNumber: string;
    publicPhoneNumber: string;
  };
  collections: {
    maxCollections: number;
    cacheTime: string;
  };
  newsletter: {
    service: string;
    apiKey: string;
    listId: string;
  };
  payment: {
    provider: string;
  };
}

export default function AdminDashboard() {
  const [config, setConfig] = useState<ConfigData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("shopify");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const router = useRouter();

  // Check authentication on component mount
  useEffect(() => {
    const authStatus = sessionStorage.getItem("adminAuthenticated");
    const loginTime = sessionStorage.getItem("adminLoginTime");
    
    // Check if authenticated and session is not expired (24 hours)
    if (authStatus === "true" && loginTime) {
      const currentTime = Date.now();
      const sessionAge = currentTime - parseInt(loginTime);
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours
      
      if (sessionAge < maxAge) {
        setIsAuthenticated(true);
        fetchConfig();
      } else {
        // Session expired
        sessionStorage.removeItem("adminAuthenticated");
        sessionStorage.removeItem("adminLoginTime");
        setShowLogin(true);
        setLoading(false);
      }
    } else {
      setShowLogin(true);
      setLoading(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    
    if (verifyAdminCredentials(username, password)) {
      sessionStorage.setItem("adminAuthenticated", "true");
      sessionStorage.setItem("adminLoginTime", Date.now().toString());
      setIsAuthenticated(true);
      setShowLogin(false);
      fetchConfig();
    } else {
      setAuthError("Invalid username or password");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuthenticated");
    sessionStorage.removeItem("adminLoginTime");
    setIsAuthenticated(false);
    setShowLogin(true);
    setUsername("");
    setPassword("");
    setMessage("");
  };

  const fetchConfig = async () => {
    try {
      const response = await fetch("/api/admin/config");
      const data = await response.json();
      if (data.success) {
        setConfig(data.config);
      } else {
        setMessage("Failed to load configuration");
      }
    } catch (error) {
      setMessage("Error loading configuration");
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async () => {
    if (!config) return;
    
    setSaving(true);
    setMessage("");
    
    try {
      const response = await fetch("/api/admin/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      });
      
      const data = await response.json();
      if (data.success) {
        setMessage("Configuration saved successfully!");
      } else {
        setMessage("Failed to save configuration");
      }
    } catch (error) {
      setMessage("Error saving configuration");
    } finally {
      setSaving(false);
    }
  };

  const updateConfig = (section: keyof ConfigData, field: string, value: any) => {
    if (!config) return;
    
    setConfig({
      ...config,
      [section]: {
        ...config[section],
        [field]: value,
      },
    });
  };

  const generateAdminToken = async () => {
    try {
      setMessage("Generating admin token...");
      const response = await fetch("/api/admin-token", {
        method: "POST",
      });
      
      const data = await response.json();
      if (data.success) {
        // Auto-update the admin token field
        updateConfig("shopify", "adminAccessToken", data.accessToken);
        setMessage(`✅ Admin token generated! Token: ${data.accessToken.substring(0, 20)}...`);
      } else {
        setMessage(`❌ Failed to generate token: ${data.error}`);
      }
    } catch (error) {
      setMessage("Error generating admin token");
    }
  };

  // Show login form if not authenticated
  if (showLogin) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-600">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Admin Login
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              LilyaArt Admin Dashboard
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  placeholder="Enter username"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  placeholder="Enter password"
                />
              </div>
            </div>

            {authError && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-800">{authError}</div>
              </div>
            )}

            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Sign in
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-gray-100 px-2 text-gray-500">Secure Access</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading configuration...</p>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Failed to load configuration</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">LilyaArt Admin Dashboard</h1>
            <div className="flex space-x-4">
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm"
              >
                Logout
              </button>
              <button
                onClick={saveConfig}
                disabled={saving}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Configuration"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {message && (
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4`}>
          <div className={`p-4 rounded-md ${message.includes("success") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
            {message}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {["shopify", "site", "notifications", "emailService", "whatsappService", "collections", "newsletter", "payment"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1).replace(/([A-Z])/g, ' $1')}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "shopify" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Shopify Configuration</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Store Domain</label>
                    <input
                      type="text"
                      value={config.shopify.storeDomain}
                      onChange={(e) => updateConfig("shopify", "storeDomain", e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Storefront Access Token</label>
                    <input
                      type="password"
                      value={config.shopify.storefrontAccessToken}
                      onChange={(e) => updateConfig("shopify", "storefrontAccessToken", e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Webhook Secret</label>
                    <input
                      type="password"
                      value={config.shopify.webhookSecret}
                      onChange={(e) => updateConfig("shopify", "webhookSecret", e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Revalidation Secret</label>
                    <input
                      type="password"
                      value={config.shopify.revalidationSecret}
                      onChange={(e) => updateConfig("shopify", "revalidationSecret", e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Public URL</label>
                    <input
                      type="text"
                      value={config.shopify.publicUrl}
                      onChange={(e) => updateConfig("shopify", "publicUrl", e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Admin Access Token</label>
                    <div className="flex space-x-2">
                      <input
                        type="password"
                        value={config.shopify.adminAccessToken}
                        onChange={(e) => updateConfig("shopify", "adminAccessToken", e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      <button
                        onClick={generateAdminToken}
                        className="mt-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm whitespace-nowrap"
                      >
                        Generate Token
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Click "Generate Token" to create a new admin API token automatically</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Client ID</label>
                    <input
                      type="text"
                      value={config.shopify.clientId}
                      onChange={(e) => updateConfig("shopify", "clientId", e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Client Secret</label>
                    <input
                      type="password"
                      value={config.shopify.clientSecret}
                      onChange={(e) => updateConfig("shopify", "clientSecret", e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "site" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Site Configuration</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Company Name</label>
                    <input
                      type="text"
                      value={config.site.companyName}
                      onChange={(e) => updateConfig("site", "companyName", e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Site Name</label>
                    <input
                      type="text"
                      value={config.site.siteName}
                      onChange={(e) => updateConfig("site", "siteName", e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Notification Configuration</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={config.notifications.enableEmail}
                        onChange={(e) => updateConfig("notifications", "enableEmail", e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">Enable Email Notifications</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={config.notifications.enableWhatsApp}
                        onChange={(e) => updateConfig("notifications", "enableWhatsApp", e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">Enable WhatsApp Notifications</span>
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Admin Email</label>
                    <input
                      type="email"
                      value={config.notifications.adminEmail}
                      onChange={(e) => updateConfig("notifications", "adminEmail", e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Custom Order Message</label>
                    <textarea
                      value={config.notifications.customMessage}
                      onChange={(e) => updateConfig("notifications", "customMessage", e.target.value)}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "emailService" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Email Service Configuration</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Provider</label>
                    <select
                      value={config.emailService.provider}
                      onChange={(e) => updateConfig("emailService", "provider", e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="sendgrid">SendGrid</option>
                      <option value="ses">AWS SES</option>
                      <option value="resend">Resend</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">API Key</label>
                    <input
                      type="password"
                      value={config.emailService.apiKey}
                      onChange={(e) => updateConfig("emailService", "apiKey", e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">From Email</label>
                    <input
                      type="email"
                      value={config.emailService.fromEmail}
                      onChange={(e) => updateConfig("emailService", "fromEmail", e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">From Name</label>
                    <input
                      type="text"
                      value={config.emailService.fromName}
                      onChange={(e) => updateConfig("emailService", "fromName", e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "whatsappService" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">WhatsApp Service Configuration</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Provider</label>
                    <select
                      value={config.whatsappService.provider}
                      onChange={(e) => updateConfig("whatsappService", "provider", e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="callmebot">CallMeBot (Free)</option>
                      <option value="twilio">Twilio</option>
                      <option value="whatsapp-business">WhatsApp Business</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">API Key</label>
                    <input
                      type="password"
                      value={config.whatsappService.apiKey}
                      onChange={(e) => updateConfig("whatsappService", "apiKey", e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                      type="text"
                      value={config.whatsappService.phoneNumber}
                      onChange={(e) => updateConfig("whatsappService", "phoneNumber", e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Public Phone Number</label>
                    <input
                      type="text"
                      value={config.whatsappService.publicPhoneNumber}
                      onChange={(e) => updateConfig("whatsappService", "publicPhoneNumber", e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "collections" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Collections Configuration</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Max Collections</label>
                    <input
                      type="number"
                      value={config.collections.maxCollections}
                      onChange={(e) => updateConfig("collections", "maxCollections", parseInt(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Cache Time</label>
                    <input
                      type="text"
                      value={config.collections.cacheTime}
                      onChange={(e) => updateConfig("collections", "cacheTime", e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "newsletter" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Newsletter Configuration</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Service</label>
                    <input
                      type="text"
                      value={config.newsletter.service}
                      onChange={(e) => updateConfig("newsletter", "service", e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">API Key</label>
                    <input
                      type="password"
                      value={config.newsletter.apiKey}
                      onChange={(e) => updateConfig("newsletter", "apiKey", e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">List ID</label>
                    <input
                      type="text"
                      value={config.newsletter.listId}
                      onChange={(e) => updateConfig("newsletter", "listId", e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "payment" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Payment Configuration</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Provider</label>
                    <select
                      value={config.payment.provider}
                      onChange={(e) => updateConfig("payment", "provider", e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="demo">Demo</option>
                      <option value="stripe">Stripe</option>
                      <option value="paypal">PayPal</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}