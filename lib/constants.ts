// Constants for deployment

export const defaultSort = "CREATED_AT_DESC";

export const sorting = [
  { value: "CREATED_AT_DESC", label: "Newest", reverse: false },
  { value: "CREATED_AT_ASC", label: "Oldest", reverse: true },
  { value: "PRICE_ASC", label: "Price: Low to High", reverse: false },
  { value: "PRICE_DESC", label: "Price: High to Low", reverse: true },
];

export const HIDDEN_PRODUCT_TAG = "hidden";

export const SHOPIFY_GRAPHQL_API_ENDPOINT = "/api/2024-01/graphql.json";

export const TAGS = {
  collections: "collections",
  products: "products",
};
