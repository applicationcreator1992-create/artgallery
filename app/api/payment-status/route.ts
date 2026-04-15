import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        {
          error: "Order ID is required",
        },
        { status: 400 },
      );
    }

    // In a real implementation, you would check the payment status
    // with your payment provider (Stripe, PayPal, etc.)
    console.log(`Checking payment status for order: ${orderId}`);

    // For demo purposes, simulate payment status check
    // In production, integrate with your payment provider's API

    // Simulate different statuses based on order ID patterns
    let status = "processing";
    let message = "Payment is being processed";

    if (orderId.includes("APPROVED")) {
      status = "completed";
      message = "Payment completed successfully";
    } else if (orderId.includes("DECLINED")) {
      status = "declined";
      message = "Payment was declined";
    } else if (orderId.includes("FAILED")) {
      status = "failed";
      message = "Payment failed";
    }

    return NextResponse.json({
      orderId,
      status,
      message,
      timestamp: new Date().toISOString(),
      // Include debug info
      debug: {
        provider: process.env.PAYMENT_PROVIDER || "demo",
        environment: process.env.NODE_ENV,
        orderIdPattern: orderId,
      },
    });
  } catch (error) {
    console.error("Payment status check error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Payment status check endpoint",
    usage: {
      endpoint: "/api/payment-status",
      method: "POST",
      description: "Check the status of a payment/order",
      requestBody: {
        orderId: "ORDER-123456789",
      },
    },
    configuration: {
      paymentProvider: process.env.PAYMENT_PROVIDER || "demo",
      shopifyAdminToken: !!process.env.SHOPIFY_ADMIN_ACCESS_TOKEN,
      shopifyStoreDomain: process.env.SHOPIFY_STORE_DOMAIN,
    },
  });
}
