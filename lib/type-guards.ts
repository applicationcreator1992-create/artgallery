// Type guards for Shopify integration

export function isShopifyError(error: any): error is { message: string } {
  return error && typeof error === "object" && "message" in error;
}
