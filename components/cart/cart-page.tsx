"use client";

import { MinusIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Price from "components/price";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart, type LocalCartItem } from "./cart-context";

export function CartPage() {
  const { items, totalQuantity, totalPrice, removeItem, updateQuantity } =
    useCart();
  const router = useRouter();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0) return;

    setIsCheckingOut(true);
    try {
      // This will create Shopify cart and redirect to checkout
      router.push("/checkout");
    } catch (error) {
      console.error("Checkout error:", error);
      alert("There was an error proceeding to checkout. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <div className="text-center">
          <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
            Shopping Cart
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Your cart is empty. Add some items to get started!
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-8 rounded-full bg-blue-600 px-8 py-3 text-white hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
        Shopping Cart ({totalQuantity} items)
      </h1>

      <div className="space-y-4">
        {items.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onRemove={removeItem}
            onUpdateQuantity={updateQuantity}
          />
        ))}
      </div>

      <div className="mt-8 border-t pt-8">
        <div className="flex justify-between text-lg font-semibold">
          <span className="text-gray-900 dark:text-white">Total</span>
          <Price
            amount={totalPrice}
            currencyCode={items[0]?.currency || "USD"}
          />
        </div>

        <div className="mt-6 space-y-4">
          <button
            onClick={handleCheckout}
            disabled={isCheckingOut}
            className="w-full rounded-full bg-blue-600 px-8 py-3 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
          </button>

          <button
            onClick={() => router.push("/")}
            className="w-full rounded-full border border-gray-300 px-8 py-3 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

function CartItem({
  item,
  onRemove,
  onUpdateQuantity,
}: {
  item: LocalCartItem;
  onRemove: (variantId: string) => void;
  onUpdateQuantity: (variantId: string, quantity: number) => void;
}) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateQuantity = async (newQuantity: number) => {
    setIsUpdating(true);
    try {
      onUpdateQuantity(item.variantId, newQuantity);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsUpdating(true);
    try {
      onRemove(item.variantId);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center space-x-4 rounded-lg border p-4 dark:border-gray-700">
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>

      <div className="flex-1">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {item.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {item.variantTitle}
        </p>
        <Price
          amount={item.price}
          currencyCode={item.currency}
          className="mt-2"
        />
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleUpdateQuantity(item.quantity - 1)}
          disabled={isUpdating}
          className="rounded-full p-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <MinusIcon className="h-4 w-4" />
        </button>

        <span className="w-8 text-center text-gray-900 dark:text-white">
          {item.quantity}
        </span>

        <button
          onClick={() => handleUpdateQuantity(item.quantity + 1)}
          disabled={isUpdating}
          className="rounded-full p-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <PlusIcon className="h-4 w-4" />
        </button>

        <button
          onClick={handleRemove}
          disabled={isUpdating}
          className="ml-4 rounded-full p-1 text-red-600 hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-900/20"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
