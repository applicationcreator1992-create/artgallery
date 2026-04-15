import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

const SHOPIFY_WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET || "";

async function handleCollectionUpdate(data: any) {
  console.log("📚 Collection update webhook received:", data);

  if (data.handle) {
    await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/revalidate?path=/collection/${data.handle}&secret=${process.env.SHOPIFY_REVALIDATION_SECRET}`,
    );
    console.log(`✅ Revalidated collection page: /collection/${data.handle}`);
  }

  await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/revalidate?path=/&secret=${process.env.SHOPIFY_REVALIDATION_SECRET}`,
  );
  console.log("✅ Revalidated homepage for collection change");
}

function verifyWebhook(body: string, signature: string): boolean {
  if (!SHOPIFY_WEBHOOK_SECRET) {
    console.error("❌ SHOPIFY_WEBHOOK_SECRET not configured");
    return false;
  }

  const calculatedSignature = crypto
    .createHmac("sha256", SHOPIFY_WEBHOOK_SECRET)
    .update(body, "utf8")
    .digest("base64");

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(calculatedSignature),
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-shopify-hmac-sha256") || "";
    const topic = request.headers.get("x-shopify-topic") || "";
    const shop = request.headers.get("x-shopify-shop-domain") || "";

    console.log(`🔔 Collection webhook received: ${topic} from ${shop}`);

    if (!verifyWebhook(body, signature)) {
      console.error("❌ Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    let data;
    try {
      data = JSON.parse(body);
    } catch (error) {
      console.error("❌ Invalid JSON in webhook body");
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    if (topic === "COLLECTIONS_UPDATE") {
      await handleCollectionUpdate(data);
    } else {
      console.log(`ℹ️ Unexpected topic for collection webhook: ${topic}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Collection webhook processing error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: "Collection webhook endpoint ready",
    topic: "COLLECTIONS_UPDATE",
  });
}
