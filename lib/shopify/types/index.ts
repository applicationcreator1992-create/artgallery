// Shopify types for deployment

export interface ProductOption {
  id: string;
  name: string;
  values: string[];
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml?: string;
  price: string;
  image?: string;
  images?: Array<{
    url: string;
    altText?: string;
  }>;
  featuredImage?: {
    url: string;
    width?: number;
    height?: number;
    altText?: string;
  };
  tags?: string[];
  seo?: {
    title?: string;
    description?: string;
  };
  availableForSale?: boolean;
  priceRange?: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  updatedAt?: string;
  variants?: ProductVariant[];
  options?: ProductOption[];
}

export interface ProductVariant {
  id: string;
  title: string;
  price: string;
  availableForSale?: boolean;
  sku?: string;
  compareAtPrice?: string;
  selectedOptions?: Array<{
    name: string;
    value: string;
  }>;
}

export interface Collection {
  handle: string;
  title: string;
  description: string;
  path?: string;
  updatedAt?: string;
  image?: {
    url: string;
  };
  seo?: {
    title?: string;
    description?: string;
  };
}

export interface Image {
  url: string;
  altText?: string;
  width?: number;
  height?: number;
}

export interface Menu {
  handle: string;
  title: string;
  path?: string;
  items?: Array<{
    title: string;
    url: string;
  }>;
}

export interface GalleryImage {
  src: string;
  altText: string;
}
