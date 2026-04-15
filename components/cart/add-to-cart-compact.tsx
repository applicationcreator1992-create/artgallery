"use client";

import { PlusIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Product, ProductVariant } from "lib/shopify/types";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useCart } from "./cart-context";

function SubmitButton({
  availableForSale,
  selectedVariantId,
  isAdding,
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
  isAdding: boolean;
}) {
  const buttonClasses =
    "relative flex items-center justify-center rounded-full bg-blue-600 px-3 py-2 text-sm text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";
  const disabledClasses = "cursor-not-allowed opacity-60 hover:opacity-60";
  const addingClasses = "bg-blue-700 hover:bg-blue-700";

  if (!availableForSale) {
    return (
      <div
        className="flex items-center justify-center rounded-full bg-red-100 border border-red-300 px-3 py-2 text-sm font-semibold text-red-600"
        title="Out of Stock"
      >
        Out of Stock
      </div>
    );
  }

  if (!selectedVariantId) {
    return (
      <button
        aria-label="Please select an option"
        disabled
        className={clsx(buttonClasses, disabledClasses)}
        title="Please select an option"
      >
        <PlusIcon className="h-4 w-4 mr-2" />
        Add to Cart
      </button>
    );
  }

  return (
    <button
      type="submit"
      aria-label="Add to cart"
      disabled={isAdding}
      className={clsx(buttonClasses, {
        "hover:bg-blue-700": !isAdding,
        [addingClasses]: isAdding,
      })}
      title="Add to cart"
    >
      <PlusIcon className="h-4 w-4 mr-2" />
      {isAdding ? "Adding..." : "Add to Cart"}
    </button>
  );
}

export function AddToCartCompact({ product }: { product: Product }) {
  const { variants, availableForSale } = product;
  const searchParams = useSearchParams();
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCart();

  const variant = (variants || []).find((variant: ProductVariant) =>
    (variant.selectedOptions || []).every(
      (option) => option.value === searchParams.get(option.name.toLowerCase()),
    ),
  );
  const defaultVariantId =
    (variants || []).length === 1 ? (variants || [])[0]?.id : undefined;
  const selectedVariantId = variant?.id || defaultVariantId;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVariantId) return;

    // Find the actual variant object
    const selectedVariant = (variants || []).find(
      (v) => v.id === selectedVariantId,
    );
    if (!selectedVariant) {
      console.error("Selected variant not found:", selectedVariantId);
      return;
    }

    setIsAdding(true);
    try {
      // Add to local cart immediately
      addItem(selectedVariant, product);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="inline-flex">
      <input
        type="hidden"
        name="selectedVariantId"
        value={selectedVariantId || ""}
      />
      <SubmitButton
        availableForSale={availableForSale || false}
        selectedVariantId={selectedVariantId}
        isAdding={isAdding}
      />
    </form>
  );
}
