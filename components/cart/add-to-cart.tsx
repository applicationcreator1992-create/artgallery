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
    "relative flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white transition-all duration-200";
  const disabledClasses = "cursor-not-allowed opacity-60 hover:opacity-60";
  const addingClasses = "bg-blue-700 hover:bg-blue-700";

  if (!availableForSale) {
    return (
      <button disabled className={clsx(buttonClasses, disabledClasses)}>
        Out Of Stock
      </button>
    );
  }

  if (!selectedVariantId) {
    return (
      <button
        aria-label="Please select an option"
        disabled
        className={clsx(buttonClasses, disabledClasses)}
      >
        <div className="absolute left-0 ml-4">
          <PlusIcon className="h-5" />
        </div>
        Add To Cart
      </button>
    );
  }

  return (
    <button
      type="submit"
      aria-label="Add to cart"
      disabled={isAdding}
      className={clsx(buttonClasses, {
        "hover:opacity-90": !isAdding,
        [addingClasses]: isAdding,
      })}
    >
      <div className="absolute left-0 ml-4">
        {isAdding ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
        ) : (
          <PlusIcon className="h-5" />
        )}
      </div>
      {isAdding ? "Adding..." : "Add To Cart"}
    </button>
  );
}

export function AddToCart({ product }: { product: Product }) {
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
    <form onSubmit={handleSubmit}>
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
