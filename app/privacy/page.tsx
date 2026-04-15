import { Metadata } from "next";

import PageHeader from "components/page-header/page-header";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy - LilyaArt",
  description:
    "Privacy Policy for LilyaArt - Learn how we protect and handle your personal information",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        title="Privacy Policy"
        subtitle="Your privacy is important to us. This policy explains how we collect, use, and protect your information."
      />
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your privacy is important to us. This policy explains how we
              collect, use, and protect your information.
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            {/* Information We Collect */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Information We Collect
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  <strong>Personal Information:</strong> When you create an
                  account, make a purchase, or contact us, we collect
                  information such as your name, email address, phone number,
                  and billing/shipping addresses.
                </p>
                <p>
                  <strong>Payment Information:</strong> We collect payment
                  method details through secure third-party payment processors.
                  We do not store complete credit card numbers on our servers.
                </p>
                <p>
                  <strong>Usage Data:</strong> We automatically collect
                  information about how you interact with our website, including
                  IP address, browser type, and pages visited.
                </p>
                <p>
                  <strong>Communication Data:</strong> We record communications
                  with you to provide customer service and improve our services.
                </p>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                How We Use Your Information
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  <strong>To Provide Services:</strong> We use your information
                  to process orders, deliver artwork, and provide customer
                  support.
                </p>
                <p>
                  <strong>To Personalize Experience:</strong> We may use your
                  information to personalize your browsing experience and
                  recommend artwork based on your preferences.
                </p>
                <p>
                  <strong>To Communicate:</strong> We use your contact
                  information to send order confirmations, shipping updates, and
                  marketing communications (with your consent).
                </p>
                <p>
                  <strong>To Improve Our Website:</strong> We analyze usage data
                  to improve our website functionality and user experience.
                </p>
              </div>
            </section>

            {/* Information Sharing */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Information Sharing
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  <strong>
                    We do not sell, trade, or rent your personal information
                  </strong>{" "}
                  to third parties without your consent, except as described in
                  this policy.
                </p>
                <p>
                  <strong>Service Providers:</strong> We share information with
                  trusted third-party service providers who assist in operating
                  our website, conducting business, or servicing customers.
                </p>
                <p>
                  <strong>Legal Requirements:</strong> We may disclose your
                  information if required by law or in good faith belief that
                  such action is necessary to comply with legal obligations.
                </p>
                <p>
                  <strong>Business Transfers:</strong> If we are involved in a
                  merger, acquisition, or sale of assets, your information may
                  be transferred as part of the transaction.
                </p>
              </div>
            </section>

            {/* Data Security */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Data Security
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  We implement appropriate technical and organizational measures
                  to protect your personal information against unauthorized
                  access, alteration, disclosure, or destruction.
                </p>
                <p>
                  All online transactions are secured using SSL encryption
                  technology. We use industry-standard security protocols and
                  regularly review our security measures.
                </p>
                <p>
                  However, no method of transmission over the internet or method
                  of electronic storage is 100% secure. While we strive to
                  protect your personal information, we cannot guarantee
                  absolute security.
                </p>
              </div>
            </section>

            {/* Your Rights */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Your Rights
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  <strong>Access and Correction:</strong> You have the right to
                  access and update your personal information through your
                  account settings.
                </p>
                <p>
                  <strong>Data Portability:</strong> You can request a copy of
                  your personal information in a machine-readable format.
                </p>
                <p>
                  <strong>Opt-out:</strong> You can opt out of marketing
                  communications at any time by clicking the unsubscribe link or
                  contacting us.
                </p>
                <p>
                  <strong>Account Deletion:</strong> You can request deletion of
                  your account and personal information, subject to legal
                  retention requirements.
                </p>
              </div>
            </section>

            {/* Cookies and Tracking */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Cookies and Tracking
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  We use cookies and similar tracking technologies to enhance
                  your experience, analyze traffic, and personalize content. You
                  can control cookie settings through your browser preferences.
                </p>
                <p>
                  <strong>Essential Cookies:</strong> Required for basic website
                  functionality.
                </p>
                <p>
                  <strong>Analytics Cookies:</strong> Help us understand how
                  visitors use our website.
                </p>
                <p>
                  <strong>Marketing Cookies:</strong> Used to deliver relevant
                  advertisements and content.
                </p>
              </div>
            </section>

            {/* Children's Privacy */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Children's Privacy
              </h2>
              <div className="text-gray-600">
                <p>
                  Our website is not intended for children under 13 years of
                  age. We do not knowingly collect personal information from
                  children under 13. If we become aware that we have collected
                  information from a child under 13, we will take steps to
                  delete such information immediately.
                </p>
              </div>
            </section>

            {/* Policy Updates */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Changes to This Policy
              </h2>
              <div className="text-gray-600">
                <p>
                  We may update this privacy policy from time to time. We will
                  notify you of any changes by posting the new policy on this
                  page and updating the "Last Updated" date.
                </p>
                <p>
                  <strong>Last Updated:</strong> March 14, 2025
                </p>
              </div>
            </section>

            {/* Contact */}
            <section className="bg-gray-50 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Questions About Privacy?
              </h2>
              <p className="text-gray-600 mb-6">
                If you have any questions about this Privacy Policy, please
                contact us:
              </p>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <strong>Email:</strong> privacy@lilyaart.com
                </p>
                <Link
                  href="/contact"
                  className="inline-block bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
