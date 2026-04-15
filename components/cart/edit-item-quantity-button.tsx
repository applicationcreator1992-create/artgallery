"use client";

import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useState } from "react";
import type { LocalCartItem } from "./cart-context";
import { useCart } from "./cart-context";

function SubmitButton({
  type,
  isUpdating,
}: {
  type: "plus" | "minus";
  isUpdating: boolean;
}) {
  return (
    <button
      type="submit"
      aria-label={
        type === "plus" ? "Increase item quantity" : "Reduce item quantity"
      }
      disabled={isUpdating}
      className={clsx(
        "ease flex h-full min-w-[36px] max-w-[36px] flex-none items-center justify-center rounded-full p-2 transition-all duration-200 hover:border-neutral-800 hover:opacity-80 disabled:opacity-50",
        {
          "ml-auto": type === "minus",
        },
      )}
    >
      {isUpdating ? (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"></div>
      ) : type === "plus" ? (
        <PlusIcon className="h-4 w-4 dark:text-neutral-500" />
      ) : (
        <MinusIcon className="h-4 w-4 dark:text-neutral-500" />
      )}
    </button>
  );
}

export function EditItemQuantityButton({
  item,
  type,
}: {
  item: LocalCartItem;
  type: "plus" | "minus";
}) {
  const { updateQuantity } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const newQuantity =
        type === "plus" ? item.quantity + 1 : item.quantity - 1;
      updateQuantity(item.variantId, newQuantity);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <SubmitButton type={type} isUpdating={isUpdating} />
    </form>
  );
}
