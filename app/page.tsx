import CollectionsWrapper from "components/collections/collections-wrapper";
import Grid from "components/grid";
import Hero from "components/hero/hero";
import ProductGridItems from "components/layout/product-grid-items";
import SearchSection from "components/search/search-section";
import { defaultSort } from "lib/constants";
import { getProducts } from "lib/shopify";

export const metadata = {
  description:
    "High-performance ecommerce store built with Next.js, Vercel, and Shopify.",
  openGraph: {
    type: "website",
  },
};

// Search results component
async function SearchResults({ searchQuery }: { searchQuery: string }) {
  const sortKey = defaultSort;
  const reverse = false;

  const products = await getProducts({ sortKey, reverse, query: searchQuery });
  const resultsText = products.length > 1 ? "results" : "result";

  return (
    <div className="mx-auto max-w-(--breakpoint-2xl) px-4 py-8">
      <p className="mb-6">
        {products.length === 0
          ? "There are no products that match "
          : `Showing ${products.length} ${resultsText} for `}
        <span className="font-bold">&quot;{searchQuery}&quot;</span>
      </p>

      {products.length > 0 ? (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={products} />
        </Grid>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No products found. Try adjusting your search.
          </p>
        </div>
      )}
    </div>
  );
}

// Filtered results component
async function FilteredResults() {
  const sortKey = defaultSort;
  const reverse = false;

  // Build search query from URL filters
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    let searchQuery = "";

    const categories = params.get("categories");
    const priceRange = params.get("price");
    const size = params.get("size");
    const artist = params.get("artist");

    if (categories) {
      const categoryList = categories.split(",");
      searchQuery += " " + categoryList.join(" ");
    }

    if (priceRange) {
      searchQuery += " " + priceRange.replace(",", " ");
    }

    if (size) {
      searchQuery += " " + size.replace(",", " ");
    }

    if (artist) {
      searchQuery += " " + artist.replace(",", " ");
    }

    const products = await getProducts({
      sortKey,
      reverse,
      query: searchQuery.trim(),
    });

    return (
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 py-8">
        <p className="mb-6">
          {products.length === 0
            ? "There are no products that match your filters"
            : `Showing ${products.length} products matching your filters`}
        </p>

        {products.length > 0 ? (
          <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <ProductGridItems products={products} />
          </Grid>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No products found. Try adjusting your filters.
            </p>
          </div>
        )}
      </div>
    );
  }

  return null;
}

export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const {
    q: searchValue,
    categories,
    priceRange,
    size,
    artist,
  } = params as { [key: string]: string };

  // Check if there's a search query or filters
  const hasSearch = searchValue && searchValue.trim() !== "";
  const hasFilters = categories || priceRange || size || artist;

  return (
    <>
      <Hero />
      <SearchSection />

      {/* Show products if searching or filtering, otherwise show collections */}
      {hasSearch || hasFilters ? (
        hasSearch ? (
          <SearchResults searchQuery={searchValue!} />
        ) : (
          <FilteredResults />
        )
      ) : (
        <CollectionsWrapper maxCollections={undefined} />
      )}
    </>
  );
}
