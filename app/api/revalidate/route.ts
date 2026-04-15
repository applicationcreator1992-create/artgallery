import { revalidate } from "lib/shopify";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const response = await revalidate(req);
  return response;
}
