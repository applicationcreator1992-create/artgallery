import CollectionPagination from "./collection-pagination";
import { getCollectionsWithPagination } from "./collections-data";
import CollectionsGrid from "./collections-grid";

interface CollectionsWrapperProps {
  maxCollections?: number;
  showTitle?: boolean;
  enablePagination?: boolean;
  page?: number;
}

export default async function CollectionsWrapper({
  maxCollections,
  showTitle,
  enablePagination = true,
  page = 1,
}: CollectionsWrapperProps) {
  // If pagination is disabled, use the old method
  if (!enablePagination) {
    const { getCollectionsWithProducts } = await import("./collections-data");
    const collectionsWithProducts = await getCollectionsWithProducts();

    return (
      <CollectionsGrid
        collectionsWithProducts={collectionsWithProducts}
        maxCollections={maxCollections}
        showTitle={showTitle}
      />
    );
  }

  // NEW: Use paginated version
  const collectionsData = await getCollectionsWithPagination(
    page,
    maxCollections,
  );

  return (
    <div className="space-y-8">
      <CollectionsGrid
        collectionsWithProducts={collectionsData.collections}
        maxCollections={maxCollections}
        showTitle={showTitle}
      />

      {/* Simple pagination info */}
      <CollectionPagination
        initialData={collectionsData}
        pageSize={maxCollections || 8}
        maxPages={5}
      />
    </div>
  );
}
