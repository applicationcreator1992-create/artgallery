import { handleNewOrder } from "components/notifications/order-notifications";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-shopify-hmac-sha256") || "";
    const topic = request.headers.get("x-shopify-topic") || "";

    console.log(`🔔 Order webhook received: ${topic}`);

    // Verify webhook signature
    const crypto = require("crypto");
    const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
    
    if (!secret) {
      console.error("❌ SHOPIFY_WEBHOOK_SECRET not configured");
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
    }

    const calculatedSignature = crypto
      .createHmac("sha256", secret)
      .update(body, "utf8")
      .digest("base64");

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(calculatedSignature))) {
      console.error("❌ Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    if (topic === "orders/create") {
      const order = JSON.parse(body);
      console.log("🛒 Processing new order:", order.id);
      
      const results = await handleNewOrder(order);
      
      return NextResponse.json({ 
        success: true, 
        orderId: order.id,
        notifications: results 
      });
    }

    return NextResponse.json({ received: true, topic });
  } catch (error) {
    console.error("❌ Order webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}