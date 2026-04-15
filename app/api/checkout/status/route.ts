import { checkCheckoutStatus } from "components/cart/actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { cartId } = await request.json();

    if (!cartId) {
      return NextResponse.json(
        { error: "Cart ID is required" },
        { status: 400 },
      );
    }

    const result = await checkCheckoutStatus(cartId);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Checkout status API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
