import Grid from "components/grid";
import ProductGridItems from "components/layout/product-grid-items";
import PageHeader from "components/page-header/page-header";
import SearchSection from "components/search/search-section";
import {
  getCollectionProducts,
  getCollections,
  getProducts,
} from "lib/shopify";
import type { Product } from "lib/shopify/types";
import { notFound } from "next/navigation";

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>;
}) {
  const params = await props.params;
  const collections = await getCollections();
  const collection = collections?.find((c) => c.handle === params.handle);

  if (!collection) return { title: "Collection Not Found" };

  return {
    title: collection.seo?.title || collection.title,
    description: collection.seo?.description || collection.description,
  };
}

export default async function CollectionPage(props: {
  params: Promise<{ handle: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const {
    q: searchValue,
    categories,
    price,
    size,
    artist,
  } = searchParams as { [key: string]: string };

  // Get the collection
  const collections = await getCollections();
  const collection = collections?.find((c) => c.handle === params.handle);

  if (!collection) return notFound();

  // Check if there's a search query or filters
  const hasSearch = searchValue && searchValue.trim() !== "";
  const hasFilters = categories || price || size || artist;

  let products: Product[] = [];

  if (hasSearch || hasFilters) {
    // If searching or filtering within collection, use global search with collection context
    let searchQuery = searchValue || "";

    // Add collection context to search
    if (collection.title) {
      searchQuery += " " + collection.title;
    }

    // Add filters to search query
    if (categories) {
      const categoryList = categories.split(",");
      searchQuery += " " + categoryList.join(" ");
    }

    if (price) {
      searchQuery += " " + price.replace(",", " ");
    }

    if (size) {
      searchQuery += " " + size.replace(",", " ");
    }

    if (artist) {
      searchQuery += " " + artist.replace(",", " ");
    }

    products = await getProducts({
      sortKey: "BEST_SELLING",
      reverse: false,
      query: searchQuery.trim(),
    });
  } else {
    // Show all products in the collection
    products = await getCollectionProducts({ collection: params.handle });
  }

  const resultsText = products.length > 1 ? "products" : "product";

  return (
    <>
      <PageHeader title={collection.title} subtitle={collection.description} />
      <SearchSection />

      {/* Collection Content */}
      <div className="mx-auto max-w-4xl px-4 py-6">
        {/* Results Message */}
        {(hasSearch || hasFilters) && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            {hasSearch ? (
              <p>
                {products.length === 0
                  ? `No products found in "${collection.title}" matching your search`
                  : `Found ${products.length} ${resultsText} in "${collection.title}" matching your search`}
                {searchValue && (
                  <span className="font-bold"> "{searchValue}"</span>
                )}
              </p>
            ) : (
              <p>
                {products.length === 0
                  ? `No products found in "${collection.title}" matching your filters`
                  : `Showing ${products.length} ${resultsText} in "${collection.title}" matching your filters`}
              </p>
            )}
          </div>
        )}

        {/* Products Grid */}
        {products.length > 0 ? (
          <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <ProductGridItems products={products} />
          </Grid>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {hasSearch || hasFilters
                ? "Try adjusting your search or filters."
                : `No products found in this collection.`}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
