import { Metadata } from "next";

import PageHeader from "components/page-header/page-header";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service - LilyaArt",
  description:
    "Terms of Service for LilyaArt - Read our terms and conditions for purchasing artwork and using our platform",
};

export default function TermsPage() {
  return (
    <>
      <PageHeader
        title="Terms of Service"
        subtitle="Please read these terms carefully before using LilyaArt to purchase artwork or use our services."
      />
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Terms of Service
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Please read these terms carefully before using LilyaArt to
              purchase artwork or use our services.
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            {/* Agreement */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Agreement to Terms
              </h2>
              <div className="text-gray-600">
                <p>
                  By accessing and using LilyaArt, you accept and agree to be
                  bound by the terms and conditions of this agreement. If you do
                  not agree to abide by the terms, you are not authorized to use
                  or access our website and services.
                </p>
                <p>
                  These Terms of Service apply to all users, visitors, and
                  others who access or use the Service.
                </p>
              </div>
            </section>

            {/* Use of Website */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Use of Website
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  <strong>License:</strong> LilyaArt grants you a limited,
                  non-exclusive, non-transferable, and revocable license to
                  access and use our website for personal, non-commercial
                  purposes.
                </p>
                <p>
                  <strong>Prohibited Activities:</strong> You agree not to use
                  our website for any unlawful purposes or in any way that could
                  damage, disable, or impair our services.
                </p>
                <p>
                  <strong>User Account:</strong> You are responsible for
                  maintaining the confidentiality of your account credentials
                  and for all activities that occur under your account.
                </p>
                <p>
                  <strong>Intellectual Property:</strong> All content,
                  trademarks, and intellectual property on our website remain
                  the property of LilyaArt or respective artists.
                </p>
              </div>
            </section>

            {/* Artwork Purchases */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Artwork Purchases
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  <strong>Product Descriptions:</strong> We strive to be as
                  accurate as possible in describing our artwork. However, we do
                  not warrant that product descriptions are accurate, complete,
                  reliable, current, or error-free.
                </p>
                <p>
                  <strong>Pricing:</strong> Prices for artwork are subject to
                  change without notice. All prices are displayed in your local
                  currency and include applicable taxes.
                </p>
                <p>
                  <strong>Payment:</strong> Payment must be made at the time of
                  purchase. We accept various payment methods as listed during
                  checkout.
                </p>
                <p>
                  <strong>Order Acceptance:</strong> We reserve the right to
                  refuse or cancel any order for any reason, including but not
                  limited to artwork availability, errors in pricing, or
                  suspected fraud.
                </p>
              </div>
            </section>

            {/* Artwork Ownership and Copyright */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Artwork Ownership and Copyright
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  <strong>Copyright:</strong> All artwork displayed on LilyaArt
                  is protected by copyright and other intellectual property
                  laws. Artists retain copyright to their work unless explicitly
                  transferred.
                </p>
                <p>
                  <strong>Reproduction Rights:</strong> Purchase of artwork does
                  not include reproduction rights unless explicitly stated. You
                  may not reproduce, distribute, or create derivative works
                  without explicit permission.
                </p>
                <p>
                  <strong>Artist Rights:</strong> Artists retain all rights not
                  explicitly granted to LilyaArt, including moral rights and
                  rights to future works.
                </p>
              </div>
            </section>

            {/* Shipping and Delivery */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Shipping and Delivery
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  <strong>Risk of Loss:</strong> Title to artwork and risk of
                  loss passes to you upon delivery to the shipping carrier.
                </p>
                <p>
                  <strong>Shipping Claims:</strong> Any claims for damaged or
                  lost items must be made with the shipping carrier within their
                  specified timeframe.
                </p>
                <p>
                  <strong>International Orders:</strong> International orders
                  may be subject to import duties, taxes, and customs fees.
                  These charges are the recipient's responsibility.
                </p>
              </div>
            </section>

            {/* Returns and Refunds */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Returns and Refunds
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  <strong>Return Policy:</strong> Our return policy is detailed
                  in our Shipping & Returns page. By purchasing, you agree to
                  abide by these terms.
                </p>
                <p>
                  <strong>Refund Processing:</strong> Refunds will be processed
                  using the original payment method within 5-7 business days of
                  receiving returned artwork.
                </p>
                <p>
                  <strong>Condition Requirements:</strong> Returned artwork must
                  be in original condition and packaging to qualify for a
                  refund.
                </p>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Limitation of Liability
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  <strong>Service Availability:</strong> We do not guarantee
                  uninterrupted or error-free operation of our website and
                  services.
                </p>
                <p>
                  <strong>Indirect Damages:</strong> LilyaArt shall not be
                  liable for any indirect, incidental, special, or consequential
                  damages.
                </p>
                <p>
                  <strong>Maximum Liability:</strong> Our total liability to you
                  for any cause of action shall not exceed the amount paid by
                  you for the artwork in question.
                </p>
              </div>
            </section>

            {/* Intellectual Property Disputes */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Intellectual Property Disputes
              </h2>
              <div className="text-gray-600">
                <p>
                  If you believe that your intellectual property rights have
                  been infringed, please contact us immediately at
                  legal@lilyaart.com with detailed information about the alleged
                  infringement.
                </p>
                <p>
                  We will respond to all intellectual property complaints and
                  take appropriate action as required by law.
                </p>
              </div>
            </section>

            {/* Termination */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Termination
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  <strong>By User:</strong> You may terminate your account at
                  any time by following the account deletion process or
                  contacting us.
                </p>
                <p>
                  <strong>By LilyaArt:</strong> We may terminate or suspend your
                  account immediately, without prior notice or liability, for
                  any reason, including breach of terms.
                </p>
                <p>
                  Upon termination, your right to use the website and services
                  ceases immediately.
                </p>
              </div>
            </section>

            {/* Governing Law */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Governing Law
              </h2>
              <div className="text-gray-600">
                <p>
                  These Terms of Service shall be interpreted and governed by
                  the laws of the jurisdiction in which LilyaArt operates,
                  without regard to conflict of law principles.
                </p>
                <p>
                  Any legal action arising from these terms shall be brought in
                  the competent courts of that jurisdiction.
                </p>
              </div>
            </section>

            {/* Changes to Terms */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Changes to Terms
              </h2>
              <div className="text-gray-600">
                <p>
                  LilyaArt reserves the right to modify these terms at any time.
                  We will notify you of any changes by posting the updated terms
                  on this page.
                </p>
                <p>
                  Your continued use of our website and services after such
                  modifications constitutes acceptance of the updated terms.
                </p>
                <p>
                  <strong>Last Updated:</strong> March 14, 2025
                </p>
              </div>
            </section>

            {/* Contact */}
            <section className="bg-gray-50 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Questions About Terms?
              </h2>
              <p className="text-gray-600 mb-6">
                If you have any questions about these Terms of Service, please
                contact our legal team:
              </p>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <strong>Email:</strong> legal@lilyaart.com
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
