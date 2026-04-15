// Utility functions for deployment

export function baseUrl(): string {
  if (process.env.NEXT_PUBLIC_URL) {
    return process.env.NEXT_PUBLIC_URL;
  }
  return "https://lilyaart.vercel.app";
}

export function validateEnvironmentVariables(): boolean {
  return !!(
    process.env.SHOPIFY_STORE_DOMAIN &&
    process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN
  );
}

export function ensureStartsWith(
  stringToCheck: string,
  prefix: string,
): string {
  return stringToCheck.startsWith(prefix)
    ? stringToCheck
    : `${prefix}${stringToCheck}`;
}
