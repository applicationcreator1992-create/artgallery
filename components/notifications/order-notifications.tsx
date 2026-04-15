import crypto from "crypto";

interface ShopifyOrder {
  id: string;
  email?: string;
  phone?: string;
  total_price: string;
  currency: string;
  customer?: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
  };
  line_items: Array<{
    title: string;
    quantity: number;
    price: string;
    currency?: string;
  }>;
  shipping_address?: {
    first_name: string;
    last_name: string;
    address1: string;
    city: string;
    province: string;
    country: string;
    zip: string;
  };
  financial_status: string;
  fulfillment_status: string;
  created_at: string;
}

interface NotificationConfig {
  enableEmail: boolean;
  enableWhatsApp: boolean;
  adminEmail: string;
  adminWhatsApp: string;
  customMessage?: string;
  emailService?: {
    provider: "sendgrid" | "ses" | "resend";
    apiKey: string;
    fromEmail: string;
    fromName: string;
  };
  whatsappService?: {
    provider: "twilio" | "whatsapp-business" | "callmebot";
    apiKey?: string;
    phoneNumber?: string;
  };
}

const DEFAULT_CONFIG: NotificationConfig = {
  enableEmail: process.env.ENABLE_EMAIL_NOTIFICATIONS === "true",
  enableWhatsApp: process.env.ENABLE_WHATSAPP_NOTIFICATIONS === "true",
  adminEmail: process.env.ADMIN_EMAIL || "",
  adminWhatsApp: process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER || "",
  customMessage: process.env.CUSTOM_ORDER_MESSAGE || undefined,
  emailService: {
    provider: (process.env.EMAIL_SERVICE_PROVIDER as any) || "sendgrid",
    apiKey: process.env.EMAIL_SERVICE_API_KEY || "",
    fromEmail: process.env.EMAIL_FROM_EMAIL || process.env.ADMIN_EMAIL || "",
    fromName: process.env.EMAIL_FROM_NAME || "LilyaArt"
  },
  whatsappService: {
    provider: (process.env.WHATSAPP_SERVICE_PROVIDER as any) || "callmebot",
    apiKey: process.env.WHATSAPP_API_KEY,
    phoneNumber: process.env.WHATSAPP_PHONE_NUMBER
  }
};

/**
 * Send WhatsApp notification using CallMeBot API (free tier)
 */
async function sendWhatsAppNotification(order: ShopifyOrder, config: NotificationConfig) {
  if (!config.enableWhatsApp || !config.adminWhatsApp) {
    console.log("📱 WhatsApp notifications disabled or no phone configured");
    return false;
  }

  try {
    const customerName = order.customer 
      ? `${order.customer.first_name} ${order.customer.last_name}`
      : "Customer";
    
    const orderTotal = `${order.currency} ${order.total_price}`;
    const itemCount = order.line_items?.length || 0;
    
    let message = config.customMessage || 
      `🎉 *NEW ORDER ALERT!*\n\n` +
      `📦 *Order ID:* ${order.id}\n` +
      `👤 *Customer:* ${customerName}\n` +
      `📧 *Email:* ${order.customer?.email || order.email || "N/A"}\n` +
      `💰 *Total:* ${orderTotal}\n` +
      `📊 *Items:* ${itemCount}\n` +
      `📅 *Date:* ${new Date(order.created_at).toLocaleString()}\n\n` +
      `🚀 *Check Shopify Admin for details!*`;

    // Use CallMeBot API for free WhatsApp messaging
    if (config.whatsappService?.provider === "callmebot") {
      const apiUrl = `https://api.callmebot.com/whatsapp.php?source=${encodeURIComponent(config.adminWhatsApp)}&message=${encodeURIComponent(message)}&apikey=${config.whatsappService.apiKey}`;
      
      console.log("📱 Sending WhatsApp via CallMeBot:", { apiUrl: apiUrl.substring(0, 100) + "..." });
      
      const response = await fetch(apiUrl);
      const result = await response.json();
      
      if (result.success) {
        console.log("✅ WhatsApp notification sent successfully");
        return true;
      } else {
        console.error("❌ WhatsApp notification failed:", result);
        return false;
      }
    }
    
    // Fallback: Create wa.me link for manual sending
    const formattedPhone = config.adminWhatsApp.replace(/[\s\-\+\(\)]/g, "");
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
    
    console.log("📱 WhatsApp notification prepared (manual):", { message, whatsappUrl });
    return true;
  } catch (error) {
    console.error("❌ Failed to send WhatsApp notification:", error);
    return false;
  }
}

/**
 * Send email notification using SendGrid API
 */
async function sendEmailNotification(order: ShopifyOrder, config: NotificationConfig) {
  if (!config.enableEmail || !config.adminEmail) {
    console.log("📧 Email notifications disabled or no email configured");
    return false;
  }

  try {
    const customerName = order.customer 
      ? `${order.customer.first_name} ${order.customer.last_name}`
      : "Customer";
    
    const orderTotal = `${order.currency} ${order.total_price}`;
    
    const emailSubject = `🎉 New Order Received - ${order.id}`;
    const emailBody = `
      <h2>🎉 New Order Alert!</h2>
      <p><strong>Order ID:</strong> ${order.id}</p>
      <p><strong>Customer:</strong> ${customerName}</p>
      <p><strong>Email:</strong> ${order.customer?.email || order.email || "N/A"}</p>
      <p><strong>Phone:</strong> ${order.customer?.phone || order.phone || "N/A"}</p>
      <p><strong>Total:</strong> ${orderTotal}</p>
      <p><strong>Items:</strong> ${order.line_items?.length || 0}</p>
      <p><strong>Date:</strong> ${new Date(order.created_at).toLocaleString()}</p>
      
      <h3>Order Items:</h3>
      <ul>
        ${order.line_items?.map(item => 
          `<li>${item.title} - Quantity: ${item.quantity} - ${order.currency} ${item.price}</li>`
        ).join("") || "<li>No items found</li>"}
      </ul>
      
      ${order.shipping_address ? `
        <h3>Shipping Address:</h3>
        <p>
          ${order.shipping_address.first_name} ${order.shipping_address.last_name}<br>
          ${order.shipping_address.address1}<br>
          ${order.shipping_address.city}, ${order.shipping_address.province}<br>
          ${order.shipping_address.country} ${order.shipping_address.zip}
        </p>
      ` : ""}
      
      <p><a href="https://${process.env.SHOPIFY_STORE_DOMAIN?.replace("https://", "")}/admin/orders/${order.id}" style="background: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Order in Shopify Admin</a></p>
    `;

    // Send using SendGrid API
    if (config.emailService?.provider === "sendgrid" && config.emailService.apiKey) {
      const sendgridData = {
        personalizations: [{
          to: [{ email: config.adminEmail }],
          subject: emailSubject
        }],
        from: {
          email: config.emailService.fromEmail,
          name: config.emailService.fromName
        },
        content: [{
          type: "text/html",
          value: emailBody
        }]
      };

      const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${config.emailService.apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(sendgridData)
      });

      if (response.ok) {
        console.log("✅ Email notification sent successfully via SendGrid");
        return true;
      } else {
        const error = await response.text();
        console.error("❌ Email notification failed via SendGrid:", error);
        return false;
      }
    }
    
    // Fallback: Log email for manual sending
    console.log("📧 Email notification prepared (manual):", { 
      to: config.adminEmail, 
      subject: emailSubject,
      bodyLength: emailBody.length 
    });
    return true;
  } catch (error) {
    console.error("❌ Failed to send email notification:", error);
    return false;
  }
}

/**
 * Main order notification handler
 */
export async function handleNewOrder(order: ShopifyOrder, config: NotificationConfig = DEFAULT_CONFIG) {
  console.log("🛒 Processing new order notification:", order.id);

  const results = {
    email: false,
    whatsapp: false,
  };

  // Send notifications based on configuration
  if (config.enableEmail) {
    results.email = await sendEmailNotification(order, config);
  }

  if (config.enableWhatsApp) {
    results.whatsapp = await sendWhatsAppNotification(order, config);
  }

  console.log("📊 Notification results:", results);
  return results;
}

/**
 * Verify Shopify webhook signature
 */
export function verifyWebhook(body: string, signature: string): boolean {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("❌ SHOPIFY_WEBHOOK_SECRET not configured");
    return false;
  }

  const calculatedSignature = crypto
    .createHmac("sha256", secret)
    .update(body, "utf8")
    .digest("base64");

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(calculatedSignature),
  );
}

// Export configuration helper
export function getNotificationConfig(): NotificationConfig {
  return DEFAULT_CONFIG;
}

// Export types for external use
export type { NotificationConfig, ShopifyOrder };

