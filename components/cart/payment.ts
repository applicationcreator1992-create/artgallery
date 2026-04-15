"use server";

import { createShopifyCartAndCheckout } from "components/cart/actions";
import { LocalCartItem } from "components/cart/cart-context";
import { completeShopifyOrder } from "components/cart/order-completion";

export async function processPayment(
  paymentData: {
    email: string;
    cardNumber: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
    billingAddress?: {
      firstName: string;
      lastName: string;
      address1: string;
      city: string;
      province: string;
      country: string;
      zip: string;
    };
  },
  items: LocalCartItem[],
) {
  try {
    return await processPayment(paymentData, items);
  } catch (error) {
    console.error("Payment processing failed:", error);

    // Always return a result object, never throw
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Payment processing failed. Please try again.",
      status: "failed",
      debug: {
        errorType: typeof error,
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
    };
  }
}

async function processDemoShopifyPayment(
  paymentData: {
    email: string;
    cardNumber: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
  },
  items: LocalCartItem[],
) {
  console.log(
    "🎭 Processing demo Shopify payment (real store operations + test gateway)...",
  );

  // Validate required fields
  if (
    !paymentData.email ||
    !paymentData.cardNumber ||
    !paymentData.expiryMonth ||
    !paymentData.expiryYear ||
    !paymentData.cvv
  ) {
    return {
      success: false,
      error: "All payment fields are required",
    };
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(paymentData.email)) {
    return {
      success: false,
      error: "Please enter a valid email address",
    };
  }

  // Validate card number (basic check)
  const cardNumber = paymentData.cardNumber.replace(/\s/g, "");
  if (cardNumber.length < 13 || cardNumber.length > 19) {
    return {
      success: false,
      error: "Please enter a valid card number",
    };
  }

  // Create Shopify cart first (real store operation)
  console.log("🛒 Creating Shopify cart for demo payment...");
  const cartResult = await createShopifyCartAndCheckout(items);
  console.log("📋 Cart result received:", cartResult);

  if (!cartResult.success) {
    console.error("❌ Cart creation failed:", cartResult.error);
    return {
      success: false,
      error: cartResult.error || "Failed to create cart",
      status: "failed",
      debug: {
        step: "cart_creation",
        cartResult: cartResult,
      },
    };
  }

  // Simulate payment processing delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Demo payment logic based on card number (Shopify test gateway)
  let paymentStatus: "approved" | "declined" | "failed";

  if (cardNumber.startsWith("1")) {
    paymentStatus = "approved";
    console.log("💳 Demo: Card starts with 1 - Payment approved");
  } else if (cardNumber.startsWith("2")) {
    paymentStatus = "declined";
    console.log("💳 Demo: Card starts with 2 - Payment declined");
  } else if (cardNumber.startsWith("3")) {
    paymentStatus = "failed";
    console.log("💳 Demo: Card starts with 3 - Payment failed");
  } else {
    paymentStatus = "declined";
    console.log(
      "💳 Demo: Card does not start with 1, 2, or 3 - Default: Payment declined",
    );
  }

  if (paymentStatus === "approved") {
    // For successful payment, complete the Shopify order (real inventory update)
    try {
      console.log(
        "🎯 Demo payment approved - Completing real Shopify order...",
      );

      // Complete the order in Shopify (updates inventory)
      const orderResult = await completeShopifyOrder(items);

      if (orderResult.success) {
        console.log("✅ Real Shopify order completed - Inventory updated");
        console.log(
          "📦 Items purchased:",
          items.map((item) => `${item.title} (x${item.quantity})`),
        );

        return {
          success: true,
          status: "completed",
          orderId: orderResult.orderId || `DEMO-ORDER-${Date.now()}`,
          message:
            "Demo payment processed successfully with real Shopify operations",
          demoMode: true,
          inventoryUpdated: orderResult.inventoryUpdated,
          itemsProcessed: orderResult.itemsProcessed,
          checkoutUrl: cartResult.checkoutUrl,
        };
      } else {
        // Order completion failed but payment succeeded
        console.error(
          "❌ Real Shopify order completion failed:",
          orderResult.error,
        );
        return {
          success: true,
          status: "completed",
          orderId: `DEMO-ORDER-${Date.now()}`,
          message:
            "Demo payment processed successfully (inventory update failed)",
          demoMode: true,
          inventoryUpdated: false,
          warning: `Payment successful but order completion failed: ${orderResult.error}. Please check Shopify admin.`,
          checkoutUrl: cartResult.checkoutUrl,
        };
      }
    } catch (inventoryError) {
      console.error("❌ Real Shopify inventory update error:", inventoryError);
      // Still return success but note inventory issue
      return {
        success: true,
        status: "completed",
        orderId: `DEMO-ORDER-${Date.now()}`,
        message:
          "Demo payment processed successfully (inventory update failed)",
        demoMode: true,
        inventoryUpdated: false,
        warning:
          "Payment successful but inventory update failed. Please check Shopify admin.",
        checkoutUrl: cartResult.checkoutUrl,
      };
    }
  } else if (paymentStatus === "declined") {
    return {
      success: false,
      status: "declined",
      error: "Demo payment declined. Please try a different payment method.",
      demoMode: true,
    };
  } else {
    return {
      success: false,
      status: "failed",
      error: "Demo payment gateway error. Please try again later.",
      demoMode: true,
    };
  }
}

async function processShopifyPayment(
  paymentData: {
    email: string;
    cardNumber: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
    billingAddress?: {
      firstName: string;
      lastName: string;
      address1: string;
      city: string;
      province: string;
      country: string;
      zip: string;
    };
  },
  items: LocalCartItem[],
) {
  // Original Shopify payment logic
  console.log("🛒 Processing Shopify payment...");

  // Validate required fields
  if (
    !paymentData.email ||
    !paymentData.cardNumber ||
    !paymentData.expiryMonth ||
    !paymentData.expiryYear ||
    !paymentData.cvv
  ) {
    return {
      success: false,
      error: "All payment fields are required",
    };
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(paymentData.email)) {
    return {
      success: false,
      error: "Please enter a valid email address",
    };
  }

  // Validate card number (basic check)
  const cardNumber = paymentData.cardNumber.replace(/\s/g, "");
  if (cardNumber.length < 13 || cardNumber.length > 19) {
    return {
      success: false,
      error: "Please enter a valid card number",
    };
  }

  // Validate expiry
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const expiryYear = parseInt(paymentData.expiryYear);
  const expiryMonth = parseInt(paymentData.expiryMonth);

  if (
    expiryYear < currentYear ||
    (expiryYear === currentYear && expiryMonth < currentMonth)
  ) {
    return {
      success: false,
      error: "Card has expired",
    };
  }

  // Validate CVV
  if (paymentData.cvv.length < 3 || paymentData.cvv.length > 4) {
    return {
      success: false,
      error: "Please enter a valid CVV",
    };
  }

  // Create Shopify cart first
  console.log("🛒 About to call createShopifyCartAndCheckout...");

  // Check if Shopify is configured
  if (!process.env.SHOPIFY_STORE_DOMAIN) {
    console.error("❌ Shopify not configured - SHOPIFY_STORE_DOMAIN not set");
    return {
      success: false,
      error:
        "Shopify store domain not configured. Please check environment variables.",
      status: "failed",
      debug: {
        step: "configuration_check",
        missing: "SHOPIFY_STORE_DOMAIN",
      },
    };
  }

  if (!process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    console.error(
      "❌ Shopify not configured - SHOPIFY_STOREFRONT_ACCESS_TOKEN not set",
    );
    return {
      success: false,
      error:
        "Shopify access token not configured. Please check environment variables.",
      status: "failed",
      debug: {
        step: "configuration_check",
        missing: "SHOPIFY_STOREFRONT_ACCESS_TOKEN",
      },
    };
  }

  const cartResult = await createShopifyCartAndCheckout(items);
  console.log("📋 Cart result received:", cartResult);

  if (!cartResult.success) {
    console.error("❌ Cart creation failed:", cartResult.error);
    return {
      success: false,
      error: cartResult.error || "Failed to create cart",
      status: "failed",
      debug: {
        step: "cart_creation",
        cartResult: cartResult,
      },
    };
  }

  // Now process payment using Shopify's checkout API
  // For Bogus gateway testing, we need to use the checkout URL with payment details
  const checkoutUrl = cartResult.checkoutUrl;

  if (!checkoutUrl) {
    return {
      success: false,
      error: "Failed to generate checkout URL",
    };
  }

  // For now, we'll simulate the Bogus gateway behavior based on card number
  // In production, you'd use Shopify's Payment API or redirect to checkout with payment data

  // Bogus gateway test codes:
  // 1 = Approved Transaction
  // 2 = Declined Transaction
  // 3 = Gateway Failure

  let paymentStatus: "approved" | "declined" | "failed";

  if (cardNumber.startsWith("1")) {
    paymentStatus = "approved";
    console.log("💳 Card starts with 1 - Payment approved");
  } else if (cardNumber.startsWith("2")) {
    paymentStatus = "declined";
    console.log("💳 Card starts with 2 - Payment declined");
  } else if (cardNumber.startsWith("3")) {
    paymentStatus = "failed";
    console.log("💳 Card starts with 3 - Payment failed");
  } else {
    // Default to declined for any other card number
    paymentStatus = "declined";
    console.log(
      "💳 Card does not start with 1, 2, or 3 - Default: Payment declined",
    );
  }

  // Simulate payment processing delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  if (paymentStatus === "approved") {
    // For successful payment, complete the Shopify order
    // This will update inventory automatically
    try {
      console.log("🎯 Payment approved - Completing Shopify order...");

      // Complete the order in Shopify (updates inventory)
      const orderResult = await completeShopifyOrder(items);

      if (orderResult.success) {
        console.log("✅ Order completed successfully - Inventory updated");
        console.log(
          "📦 Items purchased:",
          items.map((item) => `${item.title} (x${item.quantity})`),
        );

        return {
          success: true,
          status: "completed",
          orderId: orderResult.orderId || `ORDER-${Date.now()}`,
          message: "Payment processed successfully",
          checkoutUrl: checkoutUrl,
          inventoryUpdated: orderResult.inventoryUpdated,
          itemsProcessed: orderResult.itemsProcessed,
        };
      } else {
        // Order completion failed but payment succeeded
        console.error("❌ Order completion failed:", orderResult.error);
        return {
          success: true,
          status: "completed",
          orderId: `ORDER-${Date.now()}`,
          message: "Payment processed successfully",
          checkoutUrl: checkoutUrl,
          inventoryUpdated: false,
          warning: `Payment successful but order completion failed: ${orderResult.error}. Please check Shopify admin.`,
        };
      }
    } catch (inventoryError) {
      console.error("❌ Inventory update error:", inventoryError);
      // Return inventory error type
      return {
        success: false,
        status: "failed",
        error:
          "Payment processed but inventory update failed. Please contact support.",
        errorType: "inventory_error",
        errorDetails: {
          title: "Inventory Update Failed",
          description:
            "Your payment was processed successfully, but there was an issue updating our inventory. Your order is still valid.",
          suggestions: [
            "Contact our support team immediately",
            "Keep your order confirmation details",
            "We will manually update your inventory and confirm your order",
          ],
        },
      };
    }
  } else if (paymentStatus === "declined") {
    return {
      success: false,
      status: "declined",
      error:
        "Payment declined. Please try a different payment method or check your card details.",
      errorType: "payment_declined",
      errorDetails: {
        title: "Payment Declined",
        description:
          "Your payment method was declined. This could be due to insufficient funds, incorrect card details, or other bank restrictions.",
        suggestions: [
          "Check your card details and try again",
          "Use a different payment method",
          "Contact your bank if the problem persists",
        ],
      },
    };
  } else {
    return {
      success: false,
      status: "failed",
      error: "Payment gateway error. Please try again later.",
      errorType: "gateway_error",
      errorDetails: {
        title: "Payment Gateway Error",
        description:
          "There was an issue processing your payment through our payment gateway. This is a technical issue on our end.",
        suggestions: [
          "Try again in a few minutes",
          "Use a different payment method",
          "Contact support if the problem persists",
        ],
      },
    };
  }
}
