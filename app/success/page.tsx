"use client";

import { useCart } from "components/cart/cart-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SuccessPage() {
  const { checkoutStatus, cancelCheckout } = useCart();
  const router = useRouter();

  useEffect(() => {
    // Check URL parameters to determine success/failure
    const urlParams = new URLSearchParams(window.location.search);
    const orderNumber = urlParams.get("order");
    const cancelled = urlParams.get("cancelled");

    if (cancelled === "1") {
      // User cancelled checkout - redirect back to cart
      cancelCheckout();
      router.push("/cart");
    } else if (orderNumber) {
      // Successful order - cart should already be cleared by webhook
      // Just show success message
    }
  }, [router, cancelCheckout]);

  // Get order info from URL params
  const urlParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : null;
  const orderNumber = urlParams?.get("order");

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <div className="text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
          Order Successful!
        </h1>

        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Thank you for your order! Your payment has been processed successfully
          and you'll receive a confirmation email shortly.
        </p>

        {/* Order Information */}
        {orderNumber && (
          <div className="mb-8 p-6 bg-gray-50 rounded-lg dark:bg-gray-800">
            <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              Order Details
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Order Number:
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {orderNumber}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={() => router.push("/")}
            className="block w-full rounded-full bg-blue-600 px-8 py-3 text-white hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </button>

          <button
            onClick={() => router.push("/cart")}
            className="block w-full rounded-full border border-gray-300 px-8 py-3 text-gray-700 hover:bg-gray-50 transition-colors dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            View Cart
          </button>
        </div>

        <div className="mt-12 text-sm text-gray-500 dark:text-gray-400">
          <p>Need help? Contact our support team.</p>
        </div>
      </div>
    </div>
  );
}
