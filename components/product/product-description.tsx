"use client";

import { AddToCart } from "components/cart/add-to-cart";
import Price from "components/price";
import Prose from "components/prose";
import type { Product } from "lib/shopify/types";
import { VariantSelector } from "./variant-selector";

export function ProductDescription({ product }: { product: Product }) {
  return (
    <div className="space-y-6">
      {/* Product Title and Price */}
      <div className="flex flex-col border-b border-gray-200 pb-6 dark:border-neutral-700">
        <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
          {product.title}
        </h1>

        {/* Price and Availability */}
        <div className="flex items-center justify-between">
          <div className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
            <Price
              amount={product.priceRange?.maxVariantPrice?.amount || "0"}
              currencyCode={
                product.priceRange?.maxVariantPrice?.currencyCode || "USD"
              }
            />
          </div>

          {/* Availability Status */}
          <div
            className={`text-sm font-medium ${
              product.availableForSale || false
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {product.availableForSale || false ? "In Stock" : "Out of Stock"}
          </div>
        </div>

        {/* Product Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {product.tags.slice(0, 5).map((tag, index) => (
              <span
                key={index}
                className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Product Options/Variants */}
      <VariantSelector
        options={product.options || []}
        variants={product.variants || []}
      />

      {/* Product Description */}
      {product.descriptionHtml ? (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Product Description
          </h2>
          <Prose
            className="text-sm leading-relaxed text-gray-600 dark:text-gray-300"
            html={product.descriptionHtml}
          />
        </div>
      ) : product.description ? (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Product Description
          </h2>
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            {product.description}
          </p>
        </div>
      ) : null}

      {/* Additional Product Information */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Product Details
        </h2>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="font-medium text-gray-900 dark:text-white">
              Product ID:
            </dt>
            <dd className="text-gray-600 dark:text-gray-300">{product.id}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="font-medium text-gray-900 dark:text-white">
              Handle:
            </dt>
            <dd className="text-gray-600 dark:text-gray-300">
              {product.handle}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="font-medium text-gray-900 dark:text-white">
              Last Updated:
            </dt>
            <dd className="text-gray-600 dark:text-gray-300">
              {product.updatedAt
                ? new Date(product.updatedAt).toLocaleDateString()
                : "Unknown"}
            </dd>
          </div>
          {product.priceRange?.minVariantPrice?.amount !==
            product.priceRange?.maxVariantPrice?.amount && (
            <div className="flex justify-between">
              <dt className="font-medium text-gray-900 dark:text-white">
                Price Range:
              </dt>
              <dd className="text-gray-600 dark:text-gray-300">
                {product.priceRange?.minVariantPrice?.currencyCode || "USD"}{" "}
                {product.priceRange?.minVariantPrice?.amount || "0"} -{" "}
                {product.priceRange?.maxVariantPrice?.amount || "0"}
              </dd>
            </div>
          )}
        </dl>
      </div>

      {/* Add to Cart Button */}
      <AddToCart product={product} />
    </div>
  );
}
