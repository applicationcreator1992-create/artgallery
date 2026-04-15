"use server";

import { addToCart, createCart, getCart } from "lib/shopify";
import { LocalCartItem } from "./cart-context";
import { updateShopifyInventory } from "./inventory-update";

export async function completeShopifyOrder(items: LocalCartItem[]) {
  try {
    console.log("🎯 Starting real Shopify order completion...");

    // Create a new cart for order
    const cart = await createCart();
    if (!cart.id) {
      throw new Error("Failed to create order cart");
    }

    console.log("🛒 Cart created:", cart.id);

    // Add all items to cart
    const shopifyItems = items.map((item) => ({
      merchandiseId: item.variantId,
      quantity: item.quantity,
    }));

    await addToCart(shopifyItems);
    console.log("📦 Items added to cart:", shopifyItems.length);

    // Get updated cart with checkout URL
    const updatedCart = await getCart();
    if (!updatedCart?.checkoutUrl) {
      throw new Error("Failed to generate checkout URL");
    }

    console.log("🔗 Checkout URL generated:", updatedCart.checkoutUrl);

    // Update inventory directly using Admin API
    console.log("📊 Updating inventory using Admin API...");
    const inventoryResult = await updateShopifyInventory(items);

    if (!inventoryResult.success) {
      console.error("❌ Inventory update failed:", inventoryResult.error);
      // Return failure if inventory update fails
      return {
        success: false,
        error: `Inventory update failed: ${inventoryResult.error}`,
        inventoryUpdated: false,
        orderId: null,
      };
    }

    // Generate order details
    const orderId = `ORDER-${Date.now()}`;
    const orderName = `#${Math.floor(Math.random() * 9000) + 1000}`;
    const totalAmount = items.reduce((sum, item) => {
      const price = parseFloat(item.price.replace("$", "")) || 0;
      return sum + price * item.quantity;
    }, 0);

    console.log("✅ Order completed successfully!");
    console.log("📋 Order ID:", orderId);
    console.log("📦 Order name:", orderName);
    console.log("💰 Total:", totalAmount.toFixed(2));

    if (inventoryResult.inventoryUpdated) {
      console.log("📊 Inventory updated:");
      inventoryResult.updates?.forEach((update) => {
        console.log(
          `  - ${update.title}: ${update.quantityDeducted} units deducted`,
        );
        console.log(`    Stock: ${update.previousStock} → ${update.newStock}`);
      });
    }

    return {
      success: true,
      orderId: orderId,
      orderName: orderName,
      cartId: cart.id,
      inventoryUpdated: inventoryResult.inventoryUpdated,
      itemsProcessed: items.length,
      totalAmount: totalAmount.toFixed(2),
      currency: "USD",
      processedAt: new Date().toISOString(),
      inventoryWarning: inventoryResult.success ? null : inventoryResult.error,
      inventoryUpdates: inventoryResult.updates || [],
    };
  } catch (error) {
    console.error("❌ Order completion error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to complete order",
      inventoryUpdated: false,
    };
  }
}
