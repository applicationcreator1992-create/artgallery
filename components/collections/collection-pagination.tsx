"use server";

import {
  type CollectionsPagination,
  type CollectionsWithPagination,
} from "./collections-data";

interface CollectionPaginationProps {
  initialData: CollectionsWithPagination;
  pageSize?: number;
  maxPages?: number;
}

export default async function CollectionPagination({
  initialData,
  pageSize = 8,
  maxPages = 5,
}: CollectionPaginationProps) {
  const { pagination } = initialData;
  const showingCount = initialData.collections.length;
  const totalCount = pagination.totalCount;
  const currentPage = pagination.currentPage;
  const totalPages = pagination.totalPages;

  return (
    <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
      Showing {showingCount} of {totalCount} collections
      {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
      {currentPage < maxPages && pagination.hasNextPage && (
        <div className="mt-2">
          <span className="text-xs">
            More collections available on next pages
          </span>
        </div>
      )}
    </div>
  );
}

// Export pagination info component for separate use
export async function PaginationInfo({
  pagination,
}: {
  pagination: CollectionsPagination;
}) {
  return (
    <div className="text-center text-sm text-gray-600 dark:text-gray-400">
      Page {pagination.currentPage} of {pagination.totalPages}
      {" • "}
      {pagination.totalCount} total collections
    </div>
  );
}
