"use server";

import { LocalCartItem } from "../cart/cart-context";

// Shopify Admin API configuration
const SHOPIFY_ADMIN_API_VERSION = "2024-01";
const SHOPIFY_ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN?.replace(
  "https://",
  "",
)?.replace("http://", "");

console.log("🔧 Shopify Admin API Configuration:");
console.log("  - Store domain:", SHOPIFY_STORE_DOMAIN);
console.log("  - Admin token available:", !!SHOPIFY_ADMIN_ACCESS_TOKEN);
console.log("  - Admin token length:", SHOPIFY_ADMIN_ACCESS_TOKEN?.length || 0);

export async function updateShopifyInventory(items: LocalCartItem[]) {
  try {
    console.log("🎯 Starting Shopify inventory update...");
    console.log("🏪 Store domain:", SHOPIFY_STORE_DOMAIN);
    console.log("🔑 Admin token available:", !!SHOPIFY_ADMIN_ACCESS_TOKEN);
    console.log(
      "🔑 Admin token length:",
      SHOPIFY_ADMIN_ACCESS_TOKEN?.length || 0,
    );

    if (!SHOPIFY_ADMIN_ACCESS_TOKEN || !SHOPIFY_STORE_DOMAIN) {
      console.error("❌ Shopify Admin API credentials not configured");
      console.error(
        "  - SHOPIFY_ADMIN_ACCESS_TOKEN:",
        !!SHOPIFY_ADMIN_ACCESS_TOKEN ? "SET" : "NOT_SET",
      );
      console.error(
        "  - SHOPIFY_STORE_DOMAIN:",
        SHOPIFY_STORE_DOMAIN || "NOT_SET",
      );
      throw new Error("Shopify Admin API credentials not configured");
    }

    console.log("📦 Items to process:", items.length);
    items.forEach((item) => {
      console.log(
        `  - ${item.title} (x${item.quantity}) - Variant: ${item.variantId}`,
      );
    });

    const inventoryUpdates = [];
    let hasErrors = false;

    for (const item of items) {
      console.log(`📦 Processing item: ${item.title} (x${item.quantity})`);
      console.log(`   Variant ID: ${item.variantId}`);

      // Extract numeric ID from variant ID (format: gid://shopify/ProductVariant/123456789)
      const variantIdMatch = item.variantId.match(/ProductVariant\/(\d+)/);
      if (!variantIdMatch) {
        console.error(`❌ Invalid variant ID format: ${item.variantId}`);
        hasErrors = true;
        continue;
      }

      const variantId = variantIdMatch[1];
      console.log(`   Extracted variant ID: ${variantId}`);

      // First, get the inventory item ID for this variant
      const variantUrl = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_ADMIN_API_VERSION}/variants/${variantId}.json`;

      console.log(`🔍 Fetching variant details for: ${variantId}`);
      const variantResponse = await fetch(variantUrl, {
        headers: {
          "X-Shopify-Access-Token": SHOPIFY_ADMIN_ACCESS_TOKEN,
          "Content-Type": "application/json",
        },
      });

      if (!variantResponse.ok) {
        const errorText = await variantResponse.text();
        console.error(
          `❌ Failed to fetch variant ${variantId}: ${variantResponse.status} ${variantResponse.statusText}`,
        );
        console.error("Error details:", errorText);
        console.error("Request URL:", variantUrl);
        console.error("Token available:", !!SHOPIFY_ADMIN_ACCESS_TOKEN);
        console.error("Store domain:", SHOPIFY_STORE_DOMAIN);
        hasErrors = true;
        continue;
      }

      const variantData = await variantResponse.json();
      const inventoryItemId = variantData.variant?.inventory_item_id;

      if (!inventoryItemId) {
        console.error(`❌ No inventory item ID found for variant ${variantId}`);
        console.error("Variant data:", JSON.stringify(variantData, null, 2));
        hasErrors = true;
        continue;
      }

      console.log(`   Inventory item ID: ${inventoryItemId}`);

      // Get current inventory level for this inventory item
      const inventoryUrl = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_ADMIN_API_VERSION}/inventory_levels.json?inventory_item_ids=${inventoryItemId}`;

      console.log(`🔍 Fetching current inventory for item: ${inventoryItemId}`);
      const inventoryResponse = await fetch(inventoryUrl, {
        headers: {
          "X-Shopify-Access-Token": SHOPIFY_ADMIN_ACCESS_TOKEN,
          "Content-Type": "application/json",
        },
      });

      if (!inventoryResponse.ok) {
        console.error(
          `❌ Failed to fetch inventory for inventory item ${inventoryItemId}:`,
          inventoryResponse.statusText,
        );
        const errorText = await inventoryResponse.text();
        console.error("Error details:", errorText);
        hasErrors = true;
        continue;
      }

      const inventoryData = await inventoryResponse.json();
      const currentInventory = inventoryData.inventory_levels?.[0];

      if (!currentInventory) {
        console.error(
          `❌ No inventory found for inventory item ${inventoryItemId}`,
        );
        console.error(
          "Inventory response:",
          JSON.stringify(inventoryData, null, 2),
        );
        hasErrors = true;
        continue;
      }

      const currentStock = currentInventory.available || 0;
      const newStock = Math.max(0, currentStock - item.quantity);

      console.log(`   Current stock: ${currentStock}`);
      console.log(`   Quantity to deduct: ${item.quantity}`);
      console.log(`   New stock: ${newStock}`);
      console.log(`   Location ID: ${currentInventory.location_id}`);

      // Update inventory level using the correct endpoint
      const updateUrl = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_ADMIN_API_VERSION}/inventory_levels/adjust.json`;

      const updatePayload = {
        inventory_item_id: inventoryItemId,
        location_id: currentInventory.location_id,
        available_adjustment: -item.quantity, // Negative to deduct stock
      };

      console.log(
        `📤 Updating inventory with payload:`,
        JSON.stringify(updatePayload, null, 2),
      );

      const updateResponse = await fetch(updateUrl, {
        method: "POST",
        headers: {
          "X-Shopify-Access-Token": SHOPIFY_ADMIN_ACCESS_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatePayload),
      });

      if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
        console.error(
          `❌ Failed to update inventory for inventory item ${inventoryItemId}: ${updateResponse.status} ${updateResponse.statusText}`,
        );
        console.error("Error details:", errorText);
        console.error("Request URL:", updateUrl);
        console.error(
          "Request payload:",
          JSON.stringify(updatePayload, null, 2),
        );
        console.error("Token available:", !!SHOPIFY_ADMIN_ACCESS_TOKEN);
        hasErrors = true;
        continue;
      }

      const updateData = await updateResponse.json();
      console.log(
        `✅ Inventory updated for inventory item ${inventoryItemId}:`,
        JSON.stringify(updateData, null, 2),
      );

      inventoryUpdates.push({
        variantId: item.variantId,
        inventoryItemId: inventoryItemId,
        title: item.title,
        quantityDeducted: item.quantity,
        previousStock: currentStock,
        newStock: newStock,
        locationId: currentInventory.location_id,
      });
    }

    console.log("🎉 Inventory update processing completed!");
    console.log("📊 Summary:", inventoryUpdates);

    if (hasErrors) {
      console.error("❌ Some inventory updates failed");
      return {
        success: false,
        inventoryUpdated: false,
        itemsProcessed: inventoryUpdates.length,
        updates: inventoryUpdates,
        error: "Some inventory updates failed. Check logs for details.",
      };
    }

    console.log("✅ All inventory updates completed successfully!");
    return {
      success: true,
      inventoryUpdated: true,
      itemsProcessed: inventoryUpdates.length,
      updates: inventoryUpdates,
    };
  } catch (error) {
    console.error("❌ Inventory update failed:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update inventory",
      inventoryUpdated: false,
    };
  }
}
