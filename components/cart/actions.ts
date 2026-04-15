"use server";

import { addToCart, createCart, getCart } from "lib/shopify";
import { cookies } from "next/headers";
import { LocalCartItem } from "./cart-context";

export async function createShopifyCartAndCheckout(items: LocalCartItem[]) {
  try {
    console.log("🛒 Creating Shopify cart...");
    console.log("📦 Items to add:", items);

    // Create new Shopify cart
    const cart = await createCart();
    if (!cart.id) {
      console.error("❌ Failed to create Shopify cart - no cart ID returned");
      throw new Error("Failed to create Shopify cart");
    }

    console.log("✅ Cart created with ID:", cart.id);

    // Set cart ID in cookies
    (await cookies()).set("cartId", cart.id);

    // Add all items to Shopify cart
    const shopifyItems = items.map((item) => ({
      merchandiseId: item.variantId,
      quantity: item.quantity,
    }));

    console.log("📤 Adding items to cart:", shopifyItems);

    // Use the cart ID directly without relying on cookies
    await addToCart(shopifyItems);
    console.log("✅ Items added to cart");

    // Get updated cart with checkout URL
    const updatedCart = await getCart();
    if (!updatedCart?.checkoutUrl) {
      console.error("❌ Failed to generate checkout URL");
      console.error("Updated cart:", updatedCart);
      throw new Error("Failed to generate checkout URL");
    }

    console.log("🔗 Checkout URL generated:", updatedCart.checkoutUrl);

    return {
      success: true,
      checkoutUrl: updatedCart.checkoutUrl,
      cartId: cart.id,
    };
  } catch (error) {
    console.error("Checkout error:", error);
    console.error("Error type:", typeof error);
    console.error(
      "Error message:",
      error instanceof Error ? error.message : "Unknown error",
    );
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace",
    );
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function checkCheckoutStatus(cartId: string) {
  try {
    const cart = await getCart();

    if (!cart || cart.id !== cartId) {
      return { completed: false, status: "not_found" };
    }

    // Check if cart has been converted to order
    // Shopify doesn't directly expose this, but we can check cart state
    if (cart.lines.length === 0 && cart.cost.totalAmount.amount === "0") {
      return { completed: true, status: "completed" };
    }

    // Check if cart is still valid (not expired)
    // Shopify carts typically expire after 15-30 minutes
    // We'll use a conservative 30-minute check
    const maxAge = 30 * 60 * 1000; // 30 minutes

    // Since we can't reliably get cart age, we'll assume it's valid if it exists
    // and has items. Shopify handles expiration automatically.
    if (cart.lines.length === 0) {
      return { completed: false, status: "expired" };
    }

    return { completed: false, status: "pending" };
  } catch (error) {
    console.error("Error checking checkout status:", error);
    return { completed: false, status: "error" };
  }
}

export async function clearShopifyCart() {
  try {
    (await cookies()).delete("shopifyCartId");
    return { success: true };
  } catch (error) {
    console.error("Error clearing Shopify cart:", error);
    return { success: false };
  }
}
