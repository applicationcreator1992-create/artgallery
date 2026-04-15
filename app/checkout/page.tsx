"use client";

import { MinusIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useCart } from "components/cart/cart-context";
import { processPayment } from "components/cart/payment";
import { useRouter } from "next/navigation";
import { useState } from "react";

type PaymentResult = {
  success: boolean;
  status?: string;
  error?: string;
  orderId?: string;
  checkoutUrl?: string;
  message?: string;
  demoMode?: boolean;
  inventoryUpdated?: boolean;
  itemsProcessed?: number;
  errorType?: string; // Made more flexible to handle all error types
  errorDetails?: {
    title: string;
    description: string;
    suggestions: string[];
  };
  debug?: {
    step?: string;
    cartResult?: any;
    errorType?: string;
    errorMessage?: string;
    formData?: any;
    items?: any;
    warning?: string;
  };
  warning?: string;
};

export default function CheckoutPage() {
  const {
    items,
    totalQuantity,
    totalPrice,
    removeItem,
    updateQuantity,
    clearCart,
    startCheckout,
    checkoutStatus,
    setCheckoutStatus,
  } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<
    PaymentResult["errorDetails"] | null
  >(null);
  const [showErrorModal, setShowErrorModal] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    billingAddress: {
      firstName: "",
      lastName: "",
      address1: "",
      city: "",
      province: "",
      country: "",
      zip: "",
    },
  });

  // Form validation state
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};

    // Email validation
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Card number validation
    const cardNumber = formData.cardNumber.replace(/\s/g, "");
    if (!cardNumber) {
      errors.cardNumber = "Card number is required";
    } else if (cardNumber.length < 13 || cardNumber.length > 19) {
      errors.cardNumber = "Please enter a valid card number";
    }

    // Expiry validation
    if (!formData.expiryMonth || !formData.expiryYear) {
      errors.expiry = "Expiry date is required";
    } else {
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      const expiryYear = parseInt(formData.expiryYear);
      const expiryMonth = parseInt(formData.expiryMonth);

      if (
        expiryYear < currentYear ||
        (expiryYear === currentYear && expiryMonth < currentMonth)
      ) {
        errors.expiry = "Card has expired";
      }
    }

    // CVV validation
    if (!formData.cvv) {
      errors.cvv = "CVV is required";
    } else if (formData.cvv.length < 3 || formData.cvv.length > 4) {
      errors.cvv = "Please enter a valid CVV";
    }

    // Billing address validation (required for Shopify)
    if (!formData.billingAddress.firstName)
      errors.firstName = "First name is required";
    if (!formData.billingAddress.lastName)
      errors.lastName = "Last name is required";
    if (!formData.billingAddress.address1)
      errors.address1 = "Address is required";
    if (!formData.billingAddress.city) errors.city = "City is required";
    if (!formData.billingAddress.province)
      errors.province = "State/Province is required";
    if (!formData.billingAddress.country)
      errors.country = "Country is required";
    if (!formData.billingAddress.zip)
      errors.zip = "ZIP/Postal code is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleAddressChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      billingAddress: { ...prev.billingAddress, [field]: value },
    }));
    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleCardNumberChange = (value: string) => {
    // Format card number with spaces
    const formatted = value
      .replace(/\s/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim();
    handleInputChange("cardNumber", formatted);
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setError("Please fill in all required fields correctly.");
      setShowErrorModal(true);
      return;
    }

    setIsProcessing(true);
    setError(null);
    setShowErrorModal(false);

    try {
      console.log("🚀 Starting checkout process...");
      console.log("📝 Form data:", formData);
      console.log("🛒 Cart items:", items);

      const result: PaymentResult = await processPayment(formData, items);

      // Safety check for result
      if (!result) {
        console.error("❌ Payment result is null or undefined");
        throw new Error("Payment processing returned no result");
      }

      console.log("💳 Payment result:", result);
      console.log("✅ Success:", result.success);
      console.log("📊 Status:", result.status);
      console.log("📝 Error:", result.error);

      if (result.success) {
        // For successful payment, redirect immediately to success page
        // Don't set checkout status to avoid showing "checkout..." flash
        if (result.status === "completed") {
          // Clear local cart after successful payment
          clearCart();

          // Redirect to success page with order info
          const orderId = "orderId" in result ? result.orderId : "UNKNOWN";
          router.push(`/success?order=${orderId}`);
        }
      } else {
        // Handle declined or failed payments
        if (result.status === "declined") {
          setCheckoutStatus("declined");
          setPaymentError(result.errorDetails || null);
        } else if (result.status === "failed") {
          setCheckoutStatus("failed");
          setPaymentError(result.errorDetails || null);
        } else {
          // Generic error - add more logging
          console.error("❌ Unknown payment result:", result);
          console.error("❌ Result keys:", Object.keys(result));
          console.error(
            "❌ Full result object:",
            JSON.stringify(result, null, 2),
          );
          throw new Error(result.error || "Payment failed");
        }
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred",
      );
      setShowErrorModal(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRetry = () => {
    setShowErrorModal(false);
    setError(null);
    setPaymentError(null);
  };

  const handleBackToCart = () => {
    setShowErrorModal(false);
    setError(null);
    setPaymentError(null);
    setCheckoutStatus("idle");
    router.push("/cart");
  };

  // Show processing overlay during payment
  if (isProcessing) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <div className="text-center">
          <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
            Processing Payment
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Processing payment... Please wait.
          </p>
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Do not close this window while payment is being processed.
          </p>
        </div>
      </div>
    );
  }

  // Show payment declined page
  if (checkoutStatus === "declined") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <div className="text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-red-600"
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

          <h1 className="mb-4 text-3xl font-bold text-red-600 dark:text-red-400">
            {paymentError?.title || "Payment Declined"}
          </h1>

          <p className="text-gray-600 dark:text-gray-300 mb-8">
            {paymentError?.description ||
              "Your payment was declined. Please check your card details or try a different payment method."}
          </p>

          {/* Error Suggestions */}
          {paymentError?.suggestions && (
            <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800">
              <h2 className="text-lg font-semibold mb-3 text-red-800 dark:text-red-300">
                What you can try:
              </h2>
              <ul className="text-left space-y-2 text-sm text-red-700 dark:text-red-400">
                {paymentError.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={() => {
                setCheckoutStatus("idle");
                setShowErrorModal(false);
                setError(null);
                setPaymentError(null);
              }}
              className="block w-full rounded-full bg-blue-600 px-8 py-3 text-white hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>

            <button
              onClick={handleBackToCart}
              className="block w-full rounded-full border border-gray-300 px-8 py-3 text-gray-700 hover:bg-gray-50 transition-colors dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Back to Cart
            </button>
          </div>

          <div className="mt-12 text-sm text-gray-500 dark:text-gray-400">
            <p>Need help? Contact our support team.</p>
          </div>
        </div>
      </div>
    );
  }

  // Show payment failed page
  if (checkoutStatus === "failed") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <div className="text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
          </div>

          <h1 className="mb-4 text-3xl font-bold text-orange-600 dark:text-orange-400">
            {paymentError?.title || "Payment Failed"}
          </h1>

          <p className="text-gray-600 dark:text-gray-300 mb-8">
            {paymentError?.description ||
              "There was an error processing your payment. Please try again later or contact support."}
          </p>

          {/* Error Suggestions */}
          {paymentError?.suggestions && (
            <div className="mb-8 p-6 bg-orange-50 border border-orange-200 rounded-lg dark:bg-orange-900/20 dark:border-orange-800">
              <h2 className="text-lg font-semibold mb-3 text-orange-800 dark:text-orange-300">
                What you can try:
              </h2>
              <ul className="text-left space-y-2 text-sm text-orange-700 dark:text-orange-400">
                {paymentError.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={() => {
                setCheckoutStatus("idle");
                setShowErrorModal(false);
                setError(null);
                setPaymentError(null);
              }}
              className="block w-full rounded-full bg-blue-600 px-8 py-3 text-white hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>

            <button
              onClick={handleBackToCart}
              className="block w-full rounded-full border border-gray-300 px-8 py-3 text-gray-700 hover:bg-gray-50 transition-colors dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Back to Cart
            </button>
          </div>

          <div className="mt-12 text-sm text-gray-500 dark:text-gray-400">
            <p>Need help? Contact our support team.</p>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <div className="text-center">
          <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
            Checkout
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Your cart is empty. Please add items before checkout.
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-8 rounded-full bg-blue-600 px-8 py-3 text-white hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="bg-white rounded-lg border p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            Order Summary ({totalQuantity} items)
          </h2>

          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-4 pb-4 border-b dark:border-gray-700"
              >
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    {item.variantTitle}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.variantId, item.quantity - 1)
                        }
                        className="rounded-full p-1 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                      >
                        <MinusIcon className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center text-gray-900 dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.variantId, item.quantity + 1)
                        }
                        className="rounded-full p-1 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.variantId)}
                      className="text-red-600 hover:text-red-700 dark:text-red-400"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    ${item.price} each
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t pt-4 dark:border-gray-700">
            <div className="flex justify-between mb-2">
              <p className="text-gray-600 dark:text-gray-300">Subtotal</p>
              <p className="text-gray-900 dark:text-white">${totalPrice}</p>
            </div>
            <div className="flex justify-between mb-2">
              <p className="text-gray-600 dark:text-gray-300">Shipping</p>
              <p className="text-gray-900 dark:text-white">
                Calculated at checkout
              </p>
            </div>
            <div className="flex justify-between mb-2">
              <p className="text-gray-600 dark:text-gray-300">Tax</p>
              <p className="text-gray-900 dark:text-white">
                Calculated at checkout
              </p>
            </div>
            <div className="flex justify-between text-lg font-semibold text-gray-900 dark:text-white">
              <p>Total</p>
              <p>
                ${totalPrice} {items[0]?.currency || "USD"}
              </p>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="bg-white rounded-lg border p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
            Payment Information
          </h2>

          <form onSubmit={handleCheckout} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                  formErrors.email
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="your@email.com"
              />
              {formErrors.email && (
                <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
              )}
            </div>

            {/* Billing Address */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Billing Address *
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.billingAddress.firstName}
                    onChange={(e) =>
                      handleAddressChange("firstName", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                      formErrors.firstName
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    placeholder="John"
                  />
                  {formErrors.firstName && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.billingAddress.lastName}
                    onChange={(e) =>
                      handleAddressChange("lastName", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                      formErrors.lastName
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    placeholder="Doe"
                  />
                  {formErrors.lastName && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.billingAddress.address1}
                  onChange={(e) =>
                    handleAddressChange("address1", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                    formErrors.address1
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="123 Main St"
                />
                {formErrors.address1 && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.address1}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.billingAddress.city}
                    onChange={(e) =>
                      handleAddressChange("city", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                      formErrors.city
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    placeholder="New York"
                  />
                  {formErrors.city && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.city}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    State/Province
                  </label>
                  <input
                    type="text"
                    value={formData.billingAddress.province}
                    onChange={(e) =>
                      handleAddressChange("province", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                      formErrors.province
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    placeholder="NY"
                  />
                  {formErrors.province && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.province}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    value={formData.billingAddress.country}
                    onChange={(e) =>
                      handleAddressChange("country", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                      formErrors.country
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    placeholder="United States"
                  />
                  {formErrors.country && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.country}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ZIP/Postal Code
                  </label>
                  <input
                    type="text"
                    value={formData.billingAddress.zip}
                    onChange={(e) => handleAddressChange("zip", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                      formErrors.zip
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    placeholder="10001"
                  />
                  {formErrors.zip && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.zip}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Card Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Card Information *
              </h3>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 dark:bg-blue-900/20 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Testing with Bogus Gateway:</strong>
                  <br />• Use card starting with <strong>1</strong> for
                  successful payment
                  <br />• Use card starting with <strong>2</strong> for declined
                  payment
                  <br />• Use card starting with <strong>3</strong> for gateway
                  failure
                  <br />• Any 3-digit CVV and future expiry date work
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  value={formData.cardNumber}
                  onChange={(e) => handleCardNumberChange(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                    formErrors.cardNumber
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="1234 5678 9012 3456 (use 1xxx, 2xxx, or 3xxx for testing)"
                  maxLength={19}
                />
                {formErrors.cardNumber && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.cardNumber}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Expiry Date
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={formData.expiryMonth}
                      onChange={(e) =>
                        handleInputChange("expiryMonth", e.target.value)
                      }
                      className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                        formErrors.expiry
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      <option value="">Month</option>
                      {Array.from({ length: 12 }, (_, i) => (
                        <option
                          key={i + 1}
                          value={String(i + 1).padStart(2, "0")}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </option>
                      ))}
                    </select>
                    <select
                      value={formData.expiryYear}
                      onChange={(e) =>
                        handleInputChange("expiryYear", e.target.value)
                      }
                      className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                        formErrors.expiry
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      <option value="">Year</option>
                      {Array.from({ length: 10 }, (_, i) => (
                        <option
                          key={new Date().getFullYear() + i}
                          value={new Date().getFullYear() + i}
                        >
                          {new Date().getFullYear() + i}
                        </option>
                      ))}
                    </select>
                  </div>
                  {formErrors.expiry && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.expiry}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={formData.cvv}
                    onChange={(e) =>
                      handleInputChange(
                        "cvv",
                        e.target.value.replace(/\D/g, ""),
                      )
                    }
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                      formErrors.cvv
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    placeholder="123"
                    maxLength={4}
                  />
                  {formErrors.cvv && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.cvv}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full rounded-full bg-blue-600 px-8 py-3 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Processing Payment...
                </div>
              ) : (
                `Pay ${totalPrice} ${items[0]?.currency || "USD"}`
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4 dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Checkout Error
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {error || "An error occurred during checkout. Please try again."}
            </p>
            <div className="flex space-x-4">
              <button
                onClick={handleRetry}
                className="flex-1 rounded-full bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={handleBackToCart}
                className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
              >
                Back to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
