"use client";

import type { Collection, Product } from "lib/shopify/types";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// Collection Social Media Optimization Functions
interface CollectionSocialData {
  title: string;
  description: string;
  image: string;
  url: string;
  siteName: string;
}

function getCollectionSocialImage(
  collection: Collection,
  baseUrl: string = "",
): string {
  if (collection.image?.url) {
    const imageUrl = collection.image.url;
    if (imageUrl.includes("cdn.shopify.com")) {
      return `${imageUrl.split("?")[0]}?width=1200&height=630&crop=center`;
    }
    return imageUrl;
  }
  return `${baseUrl}/images/collections/default-collection-social.jpg`;
}

function generateCollectionShareData(
  collection: Collection,
  productCount: number = 0,
  baseUrl: string = "",
): CollectionSocialData {
  const title = collection.title || "Collection";
  const description =
    collection.description ||
    `Discover our ${title} collection${productCount > 0 ? ` with ${productCount} products` : ""}`;

  return {
    title,
    description,
    image: getCollectionSocialImage(collection, baseUrl),
    url: `${baseUrl}${collection.path || `/${collection.handle}`}`,
    siteName: "LilyaArt",
  };
}

function createCollectionSharePreview(
  collection: Collection,
  productCount: number = 0,
  baseUrl: string = "",
) {
  const socialData = generateCollectionShareData(
    collection,
    productCount,
    baseUrl,
  );

  return {
    ...socialData,
    productCount,
    shareText: `Check out this amazing ${collection.title} collection from LilyaArt!${productCount > 0 ? ` ${productCount} products available.` : ""}`,
    hashtags: [
      "#LilyaArt",
      "#ArtCollection",
      "#FineArt",
      collection.handle ? `#${collection.handle}` : "",
    ].join(" "),
  };
}

function createShortUrl(collection: Collection, baseUrl: string = ""): string {
  const hash = btoa(collection.handle)
    .replace(/[^a-zA-Z0-9]/g, "")
    .substring(0, 6);
  return `${baseUrl}/c/${hash}`;
}

function generateCollectionShareUrls(
  collection: Collection,
  productCount: number = 0,
  baseUrl: string = "",
) {
  const socialData = createCollectionSharePreview(
    collection,
    productCount,
    baseUrl,
  );
  const shortUrl = createShortUrl(collection, baseUrl);

  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(socialData.url)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(socialData.shareText)}&url=${encodeURIComponent(socialData.url)}&hashtags=${encodeURIComponent(socialData.hashtags)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${socialData.shareText} ${socialData.url}`)}`,
    instagram: socialData.url,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(socialData.url)}&media=${encodeURIComponent(socialData.image)}&description=${encodeURIComponent(socialData.description)}`,
    email: `mailto:?subject=${encodeURIComponent(socialData.title)}&body=${encodeURIComponent(`Check out this collection: ${socialData.description}\n\n${socialData.url}`)}`,
    shortUrl,
    directUrl: socialData.url,
  };
}

// Define the interface locally to avoid import issues
interface CollectionWithProducts {
  collection: Collection;
  products: Product[];
}

// Inline configuration for simplicity
const COLLECTIONS_CONFIG = {
  homepage: {
    maxCollections: 8,
    showTitle: true,
    priorityImages: 4,
    gridView: {
      cols: { sm: 2, lg: 3, xl: 3 },
      gap: 6,
    },
  },
};

interface CollectionCardProps {
  collection: Collection;
  priority?: boolean;
}

function CollectionCard({ collection, priority = false }: CollectionCardProps) {
  return (
    <Link
      href={collection.path || `/${collection.handle}`}
      className="group relative overflow-hidden rounded-lg border border-gray-200 transition-all duration-300 hover:border-gray-300 hover:shadow-lg"
      prefetch={true}
    >
      <div className="relative w-full">
        {/* Collection Image or Placeholder */}
        {collection.image?.url ? (
          <Image
            src={collection.image.url}
            alt={collection.title}
            width={400}
            height={400}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            priority={priority}
          />
        ) : (
          <div className="flex h-64 w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="text-center p-4">
              <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-3 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-gray-600 text-sm">No Image</p>
            </div>
          </div>
        )}

        {/* Overlay with Collection Info */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="font-semibold text-lg mb-1">{collection.title}</h3>
            {collection.description && (
              <p className="text-sm text-gray-200 line-clamp-2">
                {collection.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

// Client Component for interactive badges
function CollectionInfoBadge({
  collection,
  productCount,
}: {
  collection: Collection;
  productCount: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const badgeRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        badgeRef.current &&
        !badgeRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInfoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={badgeRef}>
      <button
        onClick={handleInfoClick}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-lg transition-all duration-200 hover:bg-white hover:scale-110"
        title="Collection Information"
      >
        <svg
          className="h-4 w-4 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>

      {/* Horizontal Compact Information Dropdown */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 whitespace-nowrap">
          <div className="flex items-center gap-4 px-4 py-3">
            <div className="flex flex-col">
              <h3 className="font-semibold text-gray-900 text-sm">
                {collection.title}
              </h3>
              <p className="text-xs text-gray-500">{productCount} items</p>
            </div>
            <div className="w-px h-8 bg-gray-200"></div>
            <Link
              href={collection.path || `/${collection.handle}`}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              View
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

// Client Component for sharing
function CollectionShareBadge({
  collection,
  productCount,
}: {
  collection: Collection;
  productCount: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const badgeRef = useRef<HTMLDivElement>(null);

  // Generate optimized sharing URLs
  const shareUrls = generateCollectionShareUrls(collection, productCount);
  const sharePreview = createCollectionSharePreview(collection, productCount);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        badgeRef.current &&
        !badgeRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleShareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    setIsOpen(!isOpen);
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(
        `${window.location.origin}${collection.path || `/${collection.handle}`}`,
      );
      setIsOpen(false);
      // Show success feedback
      const button = document.getElementById("copy-link-btn");
      if (button) {
        const originalText = button.textContent;
        button.textContent = "Copied!";
        setTimeout(() => {
          button.textContent = originalText;
        }, 2000);
      }
    }
  };

  return (
    <div className="relative" ref={badgeRef}>
      <button
        onClick={handleShareClick}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-lg transition-all duration-200 hover:bg-white hover:scale-110"
        title="Share Collection"
      >
        <svg
          className="h-4 w-4 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4m0 0L8 6m4-4v12"
          />
        </svg>
      </button>

      {/* Enhanced Share Dropdown with optimized URLs */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="flex items-center gap-2 px-3 py-2">
            {/* Instagram */}
            <a
              href={shareUrls.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
              title="Share on Instagram"
            >
              <svg
                className="w-4 h-4 text-pink-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z" />
              </svg>
            </a>

            {/* WhatsApp */}
            <a
              href={shareUrls.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
              title="Share on WhatsApp"
            >
              <svg
                className="w-4 h-4 text-green-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            </a>

            {/* Twitter */}
            <a
              href={shareUrls.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
              title="Share on Twitter"
            >
              <svg
                className="w-4 h-4 text-blue-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* Facebook */}
            <a
              href={shareUrls.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
              title="Share on Facebook"
            >
              <svg
                className="w-4 h-4 text-blue-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>

            {/* Pinterest */}
            <a
              href={shareUrls.pinterest}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
              title="Share on Pinterest"
            >
              <svg
                className="w-4 h-4 text-red-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z" />
              </svg>
            </a>

            {/* Email */}
            <a
              href={shareUrls.email}
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
              title="Share via Email"
            >
              <svg
                className="w-4 h-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </a>
          </div>

          {/* Share preview info */}
          <div className="border-t border-gray-100 p-3 text-xs text-gray-600">
            <div className="font-medium text-gray-900 mb-1">
              {sharePreview.title}
            </div>
            <div className="line-clamp-2 mb-2">{sharePreview.description}</div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Short URL:</span>
              <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                {shareUrls.shortUrl}
              </code>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// New Collection Card with Multiple Products
function MultiProductCollectionCard({
  collection,
  products,
  priority = false,
}: {
  collection: Collection;
  products: Product[];
  priority?: boolean;
}) {
  const productCount = products.length;

  if (productCount === 0) {
    // Fallback to single image card
    return <CollectionCard collection={collection} priority={priority} />;
  }

  return (
    <div className="group relative overflow-hidden rounded-lg border border-gray-200 transition-all duration-300 hover:border-gray-300 hover:shadow-lg">
      {/* Link wrapper for the card content */}
      <Link
        href={collection.path || `/${collection.handle}`}
        className="block"
        prefetch={true}
      >
        <div className="relative w-full h-64">
          {productCount === 1 && (
            // Single product - show full
            <Image
              src={products[0]?.featuredImage?.url || "/images/placeholder.jpg"}
              alt={products[0]?.title || "Product"}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              priority={priority}
            />
          )}

          {productCount === 2 && (
            // Two products - side by side
            <div className="flex h-full">
              <div className="relative w-1/2 border-r border-gray-200">
                <Image
                  src={
                    products[0]?.featuredImage?.url || "/images/placeholder.jpg"
                  }
                  alt={products[0]?.title || "Product"}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(min-width: 1024px) 12.5vw, (min-width: 768px) 16.5vw, 25vw"
                  priority={priority}
                />
              </div>
              <div className="relative w-1/2">
                <Image
                  src={
                    products[1]?.featuredImage?.url || "/images/placeholder.jpg"
                  }
                  alt={products[1]?.title || "Product"}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(min-width: 1024px) 12.5vw, (min-width: 768px) 16.5vw, 25vw"
                />
              </div>
            </div>
          )}

          {productCount >= 3 && (
            // Three or more products - different sizes
            <div className="grid grid-cols-2 grid-rows-2 h-full gap-0">
              {/* Large top image - spans 2 columns */}
              <div className="col-span-2 row-span-1 border-b border-gray-200 relative">
                <Image
                  src={
                    products[0]?.featuredImage?.url || "/images/placeholder.jpg"
                  }
                  alt={products[0]?.title || "Product"}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                  priority={priority}
                />
              </div>
              {/* Small left image */}
              <div className="col-span-1 row-span-1 border-r border-gray-200 relative">
                <Image
                  src={
                    products[1]?.featuredImage?.url || "/images/placeholder.jpg"
                  }
                  alt={products[1]?.title || "Product"}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(min-width: 1024px) 12.5vw, (min-width: 768px) 16.5vw, 25vw"
                />
              </div>
              {/* Smaller right image */}
              <div className="col-span-1 row-span-1 relative">
                <Image
                  src={
                    products[2]?.featuredImage?.url || "/images/placeholder.jpg"
                  }
                  alt={products[2]?.title || "Product"}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(min-width: 1024px) 12.5vw, (min-width: 768px) 16.5vw, 25vw"
                />
              </div>
            </div>
          )}

          {/* Overlay with Collection Info */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <h3 className="font-semibold text-lg mb-1">{collection.title}</h3>
              {collection.description && (
                <p className="text-sm text-gray-200 line-clamp-2">
                  {collection.description}
                </p>
              )}
              <p className="text-xs text-gray-300 mt-1">{productCount} items</p>
            </div>
          </div>
        </div>
      </Link>

      {/* Hover Action Badges - OUTSIDE the Link */}
      <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none">
        {/* Information Badge */}
        <div className="pointer-events-auto">
          <CollectionInfoBadge
            collection={collection}
            productCount={productCount}
          />
        </div>

        {/* Share Badge */}
        <div className="pointer-events-auto">
          <CollectionShareBadge
            collection={collection}
            productCount={productCount}
          />
        </div>
      </div>
    </div>
  );
}

interface CollectionsGridProps {
  collectionsWithProducts?: CollectionWithProducts[];
  maxCollections?: number;
  showTitle?: boolean;
}

export default function CollectionsGrid({
  collectionsWithProducts,
  maxCollections,
  showTitle,
}: CollectionsGridProps) {
  const config = COLLECTIONS_CONFIG;

  // Use provided props or fallback to config
  const maxCollectionsToShow = maxCollections || config.homepage.maxCollections;
  const shouldShowTitle =
    showTitle !== undefined ? showTitle : config.homepage.showTitle;
  const showAllCollections = maxCollections === undefined;

  if (!collectionsWithProducts || collectionsWithProducts.length === 0) {
    return null;
  }

  // Limit to maxCollections if provided, otherwise show all
  const limitedCollections = showAllCollections
    ? collectionsWithProducts
    : collectionsWithProducts.slice(0, maxCollectionsToShow);

  const gridCols = config.homepage.gridView.cols;
  const gridGap = config.homepage.gridView.gap;

  return (
    <section className="mx-auto max-w-(--breakpoint-2xl) px-4 py-8">
      {shouldShowTitle && (
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Browse Collections
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our curated collections of exceptional artwork, each
            carefully selected to bring beauty and inspiration to your space.
          </p>
        </div>
      )}

      <div
        className={`grid grid-cols-1 sm:grid-cols-${gridCols.sm} lg:grid-cols-${gridCols.lg} xl:grid-cols-${gridCols.xl} gap-${gridGap}`}
      >
        {limitedCollections.map(({ collection, products }, index) => (
          <MultiProductCollectionCard
            key={collection.handle}
            collection={collection}
            products={products}
            priority={index < config.homepage.priorityImages}
          />
        ))}
      </div>

      {!showAllCollections &&
        limitedCollections.length >= maxCollectionsToShow && (
          <div className="text-center mt-12">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 hover:shadow-md"
            >
              View All Collections
              <svg
                className="ml-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        )}
    </section>
  );
}
