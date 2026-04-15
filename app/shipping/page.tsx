import { Metadata } from "next";

import PageHeader from "components/page-header/page-header";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shipping & Returns - LilyaArt",
  description:
    "Learn about LilyaArt's shipping and return policies - Get your artwork safely and confidently",
};

export default function ShippingPage() {
  return (
    <>
      <PageHeader
        title="Shipping & Returns"
        subtitle="Everything you need to know about getting your artwork safely"
      />
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Domestic Shipping */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="text-3xl mb-4">🇺🇸</div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Domestic Shipping
              </h2>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>
                    <strong>Standard:</strong> 5-7 business days
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>
                    <strong>Express:</strong> 2-3 business days
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>
                    <strong>Free shipping</strong> on orders over $500
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>
                    <strong>Tracking:</strong> on all orders
                  </span>
                </li>
              </ul>
            </div>

            {/* International Shipping */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="text-3xl mb-4">🌍</div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                International Shipping
              </h2>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>
                    <strong>Worldwide delivery</strong> to 50+ countries
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>
                    <strong>Transit time:</strong> 7-21 business days
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>
                    <strong>Customs handling</strong> included
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>
                    <strong>Duties & taxes:</strong> customer responsibility
                  </span>
                </li>
              </ul>
            </div>

            {/* Packaging */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="text-3xl mb-4">📦</div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Professional Packaging
              </h2>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>
                    <strong>Museum-quality materials</strong> for protection
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>
                    <strong>Custom crating</strong> for fragile pieces
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>
                    <strong>Climate control</strong> for sensitive artwork
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>
                    <strong>Full insurance</strong> during transit
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Return Policy */}
          <div className="bg-black text-white rounded-lg p-8 mb-16">
            <h2 className="text-2xl font-bold mb-6">30-Day Return Policy</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">What We Accept</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    Returns within 30 days of delivery
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    Artwork in original condition
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    Original packaging preferred
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    Proof of purchase required
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  What's Not Eligible
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">✗</span>
                    Custom or commissioned pieces
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">✗</span>
                    Damaged artwork (unless shipping damage)
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">✗</span>
                    After 30 days from delivery
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">✗</span>
                    Final sale items
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Process */}
          <div className="text-center bg-gray-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              How to Initiate a Return
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-black mb-2">1</div>
                <h3 className="font-semibold text-gray-900 mb-2">Contact Us</h3>
                <p className="text-gray-600 text-sm">
                  Email hello@lilyaart.com with your order number
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-black mb-2">2</div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Receive Instructions
                </h3>
                <p className="text-gray-600 text-sm">
                  We'll email return shipping labels and instructions
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-black mb-2">3</div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Package Artwork
                </h3>
                <p className="text-gray-600 text-sm">
                  Use original packaging if possible
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-black mb-2">4</div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Receive Refund
                </h3>
                <p className="text-gray-600 text-sm">
                  Refund processed within 5-7 business days
                </p>
              </div>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Questions about shipping or returns? We're here to help!
            </p>
            <Link
              href="/contact"
              className="inline-block bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Contact Support Team
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
