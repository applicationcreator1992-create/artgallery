import { getCollectionsConfig } from "config/collections";
import { getCollectionProducts, getCollections } from "lib/shopify";
import type { Collection, Product } from "lib/shopify/types";

export interface CollectionWithProducts {
  collection: Collection;
  products: Product[];
}

// NEW: Pagination metadata interface
export interface CollectionsPagination {
  currentPage: number;
  hasNextPage: boolean;
  totalCount: number;
  pageSize: number;
  totalPages: number;
}

// NEW: Enhanced return type with pagination
export interface CollectionsWithPagination {
  collections: CollectionWithProducts[];
  pagination: CollectionsPagination;
}

// NEW: Paginated version of getCollectionsWithProducts
export async function getCollectionsWithPagination(
  page: number = 1,
  pageSize?: number,
): Promise<CollectionsWithPagination> {
  const config = getCollectionsConfig();
  const actualPageSize = pageSize || config.homepage.pagination.pageSize;
  let collections: Collection[] = [];

  try {
    collections = await getCollections();
  } catch (error) {
    console.error("Failed to fetch collections from Shopify:", error);
    collections = [];
  }

  if (!collections || collections.length === 0) {
    collections = [];
  }

  // Filter collections: exclude empty handles only
  const filteredCollections = collections.filter((collection) => {
    // Exclude empty handle
    if (collection.handle === "") return false;

    // No special filtering - all collections are treated equally

    return true;
  });

  // Sort collections by last updated date (newest first)
  const sortedCollections = [...filteredCollections].sort((a, b) => {
    const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
    const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
    return dateB - dateA;
  });

  // Calculate pagination
  const totalCount = sortedCollections.length;
  const totalPages = Math.ceil(totalCount / actualPageSize);
  const startIndex = (page - 1) * actualPageSize;
  const endIndex = startIndex + actualPageSize;
  const paginatedCollections = sortedCollections.slice(startIndex, endIndex);

  // Fetch products for each collection in the current page
  let hasShopifyErrors = false;
  const collectionsWithProducts = await Promise.all(
    paginatedCollections.map(async (collection) => {
      try {
        const products = await getCollectionProducts({
          collection: collection.handle,
        });
        return {
          collection,
          products: products || [],
        };
      } catch (error) {
        // Mark that we have Shopify errors
        hasShopifyErrors = true;

        // Reduce error noise - only log if it's not a cache-related error
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        if (
          !errorMessage.includes("Cache") &&
          !errorMessage.includes("digest")
        ) {
          console.error(
            `Error fetching products for collection ${collection.handle}:`,
            error,
          );
        } else {
          // Cache error logged
        }
        return {
          collection,
          products: [],
        };
      }
    }),
  );

  // Return all collections with products (no filtering)
  return {
    collections: collectionsWithProducts,
    pagination: {
      currentPage: page,
      hasNextPage: page < totalPages,
      totalCount: collectionsWithProducts.length,
      pageSize: actualPageSize,
      totalPages,
    },
  };
}

export async function getCollectionsWithProducts(): Promise<
  CollectionWithProducts[]
> {
  const config = getCollectionsConfig();
  let collections: Collection[] = [];

  try {
    collections = await getCollections();
  } catch (error) {
    console.error("Failed to fetch collections from Shopify:", error);
    collections = [];
  }

  if (!collections || collections.length === 0) {
    collections = [];
  }

  // Filter collections: exclude empty handles only
  const filteredCollections = collections.filter((collection) => {
    // Exclude empty handle
    if (collection.handle === "") return false;

    // No special filtering - all collections are treated equally

    return true;
  });

  // Sort collections by last updated date (newest first)
  const sortedCollections = [...filteredCollections].sort((a, b) => {
    const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
    const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
    return dateB - dateA;
  });

  // Limit to max collections
  const limitedCollections = sortedCollections.slice(
    0,
    config.homepage.maxCollections,
  );

  // Fetch products for each collection
  let hasShopifyErrors = false;
  const collectionsWithProducts = await Promise.all(
    limitedCollections.map(async (collection) => {
      try {
        const products = await getCollectionProducts({
          collection: collection.handle,
        });
        return {
          collection,
          products: products || [],
        };
      } catch (error) {
        // Mark that we have Shopify errors
        hasShopifyErrors = true;

        // Reduce error noise - only log if it's not a cache-related error
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        if (
          !errorMessage.includes("Cache") &&
          !errorMessage.includes("digest")
        ) {
          console.error(
            `Error fetching products for collection ${collection.handle}:`,
            error,
          );
        } else {
          // Cache error logged
        }
        return {
          collection,
          products: [],
        };
      }
    }),
  );

  return collectionsWithProducts;
}
