"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ErrorPage() {
  const router = useRouter();

  useEffect(() => {
    // Auto-redirect to cart after 10 seconds
    const timer = setTimeout(() => {
      router.push("/cart");
    }, 10000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <div className="text-center">
        <div className="mb-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>

        <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
          Checkout Failed
        </h1>

        <p className="mb-8 text-gray-600 dark:text-gray-300">
          We're sorry, but there was an issue processing your order. Please try
          again or contact customer support if the problem persists.
        </p>

        <div className="mb-8 rounded-lg bg-yellow-50 border border-yellow-200 p-6 dark:bg-yellow-900/20 dark:border-yellow-800">
          <h2 className="mb-2 text-lg font-semibold text-yellow-800 dark:text-yellow-200">
            Common Issues:
          </h2>
          <ul className="text-left text-yellow-700 dark:text-yellow-300 space-y-2">
            <li>• Payment method was declined</li>
            <li>• Shipping information is incomplete</li>
            <li>• Items are no longer in stock</li>
            <li>• Technical issue with payment processor</li>
          </ul>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => router.push("/cart")}
            className="inline-block rounded-full bg-blue-600 px-8 py-3 text-white hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>

          <div className="space-x-4 text-sm">
            <a href="/" className="text-blue-600 hover:text-blue-700">
              Continue Shopping
            </a>
            <span className="text-gray-400">|</span>
            <a href="/contact" className="text-blue-600 hover:text-blue-700">
              Contact Support
            </a>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            You will be automatically redirected to your cart in 10 seconds.
          </p>
        </div>
      </div>
    </div>
  );
}
