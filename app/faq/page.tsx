import { Metadata } from "next";

import PageHeader from "components/page-header/page-header";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ - LilyaArt",
  description:
    "Frequently asked questions about LilyaArt - Find answers to common questions about our artwork, shipping, and services",
};

export default function FAQPage() {
  const faqs = [
    {
      question: "How do I purchase artwork from LilyaArt?",
      answer:
        "Simply browse our collection, select the piece you love, and click 'Add to Cart'. Proceed to checkout where you can securely complete your purchase using our secure payment system.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay. All transactions are secure and encrypted.",
    },
    {
      question: "How long does shipping take?",
      answer:
        "Standard shipping typically takes 5-7 business days. Express shipping (2-3 business days) is available at checkout. International shipping times vary by location.",
    },
    {
      question: "Is the artwork authentic?",
      answer:
        "Yes! All artwork on LilyaArt is authentic and comes directly from the artists or their authorized representatives. Each piece includes a certificate of authenticity.",
    },
    {
      question: "What is your return policy?",
      answer:
        "We offer a 30-day return policy for most items. Artwork must be in its original condition. Please review our Shipping & Returns page for detailed information.",
    },
    {
      question: "Do you offer international shipping?",
      answer:
        "Yes, we ship worldwide! International shipping rates are calculated at checkout based on your location and the artwork's size and weight.",
    },
    {
      question: "How is the artwork packaged?",
      answer:
        "All artwork is professionally packaged using museum-quality materials to ensure safe arrival. Fragile pieces are custom-crated and insured during transit.",
    },
    {
      question: "Can I commission custom artwork?",
      answer:
        "Yes! We work with several artists who accept commissions. Please contact us with your requirements and we'll connect you with the right artist.",
    },
    {
      question: "Do you offer framing services?",
      answer:
        "We partner with professional framers and can arrange framing for most pieces. Contact us for framing options and pricing.",
    },
    {
      question: "How do I care for my artwork?",
      answer:
        "Care instructions vary by medium. We provide detailed care guidelines with each purchase. Generally, keep artwork away from direct sunlight and humidity.",
    },
  ];

  return (
    <>
      <PageHeader
        title="Frequently Asked Questions"
        subtitle="Find answers to common questions about our artwork and services"
      />
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          {/* FAQ Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Shopping & Orders */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Shopping & Orders
              </h2>
              <div className="space-y-6">
                {faqs.slice(0, 5).map((faq, index) => (
                  <details key={index} className="group">
                    <summary className="flex justify-between items-center cursor-pointer text-gray-900 font-medium hover:text-black transition-colors">
                      {faq.question}
                      <svg
                        className="w-5 h-5 group-open:rotate-180 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </summary>
                    <div className="mt-3 pl-4 text-gray-600">{faq.answer}</div>
                  </details>
                ))}
              </div>
            </div>

            {/* Artwork & Services */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Artwork & Services
              </h2>
              <div className="space-y-6">
                {faqs.slice(5).map((faq, index) => (
                  <details key={index + 5} className="group">
                    <summary className="flex justify-between items-center cursor-pointer text-gray-900 font-medium hover:text-black transition-colors">
                      {faq.question}
                      <svg
                        className="w-5 h-5 group-open:rotate-180 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </summary>
                    <div className="mt-3 pl-4 text-gray-600">{faq.answer}</div>
                  </details>
                ))}
              </div>
            </div>
          </div>

          {/* Still Need Help */}
          <div className="text-center bg-gray-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Still Have Questions?
            </h2>
            <p className="text-gray-600 mb-6">
              Can't find the answer you're looking for? Our team is here to
              help!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-block bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                Contact Support
              </Link>
              <Link
                href="/shipping"
                className="inline-block border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Shipping Info
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
