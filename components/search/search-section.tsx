"use client";

import { useEffect, useRef, useState } from "react";

interface FilterOption {
  id: string;
  label: string;
  value: string;
}

const FILTER_OPTIONS = {
  categories: [
    { id: "abstract", label: "Abstract", value: "abstract" },
    { id: "landscape", label: "Landscape", value: "landscape" },
    { id: "portrait", label: "Portrait", value: "portrait" },
    { id: "modern", label: "Modern Art", value: "modern" },
  ],
  price: [
    { id: "price-under-100", label: "Under $100", value: "0-100" },
    { id: "price-100-500", label: "$100-$500", value: "100-500" },
    { id: "price-over-500", label: "Over $500", value: "500+" },
  ],
};

export default function SearchSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});
  const filterRef = useRef<HTMLDivElement>(null);

  // Initialize filters from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialFilters: Record<string, string[]> = {};

    Object.keys(FILTER_OPTIONS).forEach((key) => {
      const param = params.get(key);
      if (param) {
        initialFilters[key] = param.split(",");
      }
    });

    setSelectedFilters(initialFilters);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setShowFilters(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Check if we're on a collection page
      const currentPath = window.location.pathname;

      if (currentPath.startsWith("/collection/")) {
        // If in collection, add search to current collection URL
        const url = new URL(window.location.href);
        url.searchParams.set("q", searchQuery.trim());
        // Clear filters when doing new search
        url.searchParams.delete("categories");
        url.searchParams.delete("price");
        url.searchParams.delete("size");
        url.searchParams.delete("artist");
        window.location.href = url.toString();
      } else {
        // If on homepage, stay on homepage with search params
        const url = new URL(window.location.href);
        url.searchParams.set("q", searchQuery.trim());
        // Clear filters when doing new search
        url.searchParams.delete("categories");
        url.searchParams.delete("price");
        url.searchParams.delete("size");
        url.searchParams.delete("artist");
        window.location.href = url.toString();
      }
    }
  };

  const handleFilterClick = () => {
    setShowFilters(!showFilters);
  };

  const handleFilterChange = (category: string, value: string) => {
    const newFilters = { ...selectedFilters };
    const currentFilters = newFilters[category] || [];

    if (currentFilters.includes(value)) {
      newFilters[category] = currentFilters.filter((f) => f !== value);
    } else {
      newFilters[category] = [...currentFilters, value];
    }

    setSelectedFilters(newFilters);
  };

  const applyFilters = () => {
    const params = new URLSearchParams(window.location.search);

    // Clear existing filter params
    params.delete("categories");
    params.delete("price");
    params.delete("size");
    params.delete("artist");

    // Add selected filters
    Object.entries(selectedFilters).forEach(([category, values]) => {
      if (values.length > 0) {
        params.set(category, values.join(","));
      }
    });

    // Update URL based on current page
    const currentPath = window.location.pathname;
    if (currentPath.startsWith("/collection/")) {
      // Stay in collection with filters
      const newUrl = `${currentPath}?${params.toString()}`;
      window.location.href = newUrl;
    } else {
      // Stay on homepage with filters
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.location.href = newUrl;
    }
  };

  const clearFilters = () => {
    setSelectedFilters({});
    const params = new URLSearchParams(window.location.search);

    // Clear all filter params
    params.delete("categories");
    params.delete("price");
    params.delete("size");
    params.delete("artist");

    // Update URL based on current page
    const currentPath = window.location.pathname;
    if (currentPath.startsWith("/collection/")) {
      // Stay in collection without filters
      const newUrl = `${currentPath}?${params.toString()}`;
      window.location.href = newUrl;
    } else {
      // Stay on homepage without filters
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.location.href = newUrl;
    }
  };

  const getActiveFilterCount = () => {
    return Object.values(selectedFilters).reduce(
      (total, filters) => total + filters.length,
      0,
    );
  };

  return (
    <section className="bg-white py-8 border-b">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <form onSubmit={handleSearch} className="relative">
          <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 focus-within:border-gray-400 transition-colors">
            {/* Search Icon */}
            <div className="pl-4 pr-2">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Search Input */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for art, collections, artists..."
              className="flex-1 bg-transparent border-0 outline-none py-3 px-2 text-gray-900 placeholder-gray-500 focus:ring-0"
            />

            {/* Filter Icon - Right next to search input */}
            <div className="relative" ref={filterRef}>
              <button
                type="button"
                onClick={handleFilterClick}
                className="pr-4 pl-2 text-gray-400 hover:text-gray-600 transition-colors relative"
                title="Filters"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                {getActiveFilterCount() > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                    {getActiveFilterCount()}
                  </span>
                )}
              </button>

              {/* Compact Horizontal Filter Dropdown */}
              {showFilters && (
                <div
                  className="absolute top-full right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1"
                  style={{ minWidth: "500px" }}
                >
                  <div className="p-3">
                    {/* Categories */}
                    <div className="mb-3">
                      <div className="text-xs font-medium text-gray-700 mb-2">
                        Categories
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {FILTER_OPTIONS.categories.map((option) => (
                          <label
                            key={option.id}
                            className="flex items-center gap-1 px-2 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={
                                selectedFilters.categories?.includes(
                                  option.value,
                                ) || false
                              }
                              onChange={() =>
                                handleFilterChange("categories", option.value)
                              }
                              className="h-3 w-3"
                            />
                            <span>{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Price Range */}
                    <div className="mb-3">
                      <div className="text-xs font-medium text-gray-700 mb-2">
                        Price Range
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {FILTER_OPTIONS.price.map((option) => (
                          <label
                            key={option.id}
                            className="flex items-center gap-1 px-2 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={
                                selectedFilters.price?.includes(option.value) ||
                                false
                              }
                              onChange={() =>
                                handleFilterChange("price", option.value)
                              }
                              className="h-3 w-3"
                            />
                            <span>{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="border-t p-2 bg-gray-50 flex justify-between items-center">
                    {getActiveFilterCount() > 0 && (
                      <button
                        onClick={clearFilters}
                        className="text-xs text-gray-600 hover:text-gray-800"
                      >
                        Clear
                      </button>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowFilters(false)}
                        className="px-3 py-1 text-xs text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={applyFilters}
                        className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
