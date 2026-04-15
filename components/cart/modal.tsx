"use client";

import { ShoppingCartIcon, XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import LoadingDots from "components/loading-dots";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { useCart } from "./cart-context";

type MerchandiseSearchParams = {
  [key: string]: string;
};

export default function CartModal() {
  const { items, totalQuantity, totalPrice, removeItem, updateQuantity } =
    useCart();
  const [isOpen, setIsOpen] = useState(false);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  return (
    <>
      <button
        aria-label="Open cart"
        onClick={openCart}
        className="relative flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white"
      >
        <ShoppingCartIcon className="h-4 transition-all ease-in-out hover:scale-110" />
        {totalQuantity > 0 && (
          <div className="absolute right-0 top-0 -mr-2 -mt-2 h-4 w-4 rounded-sm bg-blue-600 text-[11px] font-medium text-white">
            {totalQuantity}
          </div>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full dark:bg-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Shopping Cart
              </h2>
              <button
                onClick={closeCart}
                className="text-gray-400 hover:text-gray-500 dark:text-gray-300"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCartIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  Your cart is empty
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-b pb-4 dark:border-gray-700"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="h-16 w-16 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
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
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-300">
                          {item.variantTitle}
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          ${item.price} {item.currency}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.variantId, item.quantity - 1)
                          }
                          className="rounded-full p-1 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center text-gray-900 dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.variantId, item.quantity + 1)
                          }
                          className="rounded-full p-1 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                          <ShoppingCartIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => removeItem(item.variantId)}
                          className="ml-4 rounded-full p-1 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="border-t pt-4 dark:border-gray-700">
              <div className="flex justify-between mb-4">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Total
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  $
                  {items
                    .reduce(
                      (total, item) =>
                        total + parseFloat(item.price) * item.quantity,
                      0,
                    )
                    .toFixed(2)}{" "}
                  {items[0]?.currency || "USD"}
                </p>
              </div>
              <button
                onClick={() => (window.location.href = "/checkout")}
                className="w-full rounded-full bg-blue-600 border border-transparent px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function CloseCart({ className }: { className?: string }) {
  return (
    <div className="relative flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white">
      <XMarkIcon
        className={clsx(
          "h-6 transition-all ease-in-out hover:scale-110",
          className,
        )}
      />
    </div>
  );
}

function CheckoutButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="block w-full rounded-full bg-blue-600 p-3 text-center text-sm font-medium text-white opacity-90 hover:opacity-100"
      type="submit"
      disabled={pending}
    >
      {pending ? <LoadingDots className="bg-white" /> : "Proceed to Checkout"}
    </button>
  );
}
