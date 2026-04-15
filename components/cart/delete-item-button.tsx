"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import type { LocalCartItem } from "./cart-context";
import { useCart } from "./cart-context";

export function DeleteItemButton({ item }: { item: LocalCartItem }) {
  const { removeItem } = useCart();
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      removeItem(item.variantId);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <button
      onClick={handleRemove}
      disabled={isRemoving}
      className="rounded-full p-1 text-red-600 hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-900/20"
      title="Remove item"
    >
      {isRemoving ? (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent"></div>
      ) : (
        <XMarkIcon className="h-4 w-4" />
      )}
    </button>
  );
}
