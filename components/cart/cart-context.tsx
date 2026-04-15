"use client";

import type { Product, ProductVariant } from "lib/shopify/types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const CART_STORAGE_KEY = "shopify-local-cart";

export interface LocalCartItem {
  id: string;
  variantId: string;
  productId: string;
  title: string;
  variantTitle: string;
  price: string;
  currency: string;
  quantity: number;
  image?: string;
  handle: string;
}

type CartContextType = {
  items: LocalCartItem[];
  totalQuantity: number;
  totalPrice: string;
  addItem: (variant: ProductVariant, product: Product) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  startCheckout: (cartId: string) => void;
  cancelCheckout: () => void;
  setCheckoutStatus: (
    status: "idle" | "pending" | "completed" | "declined" | "failed",
  ) => void;
  checkoutStatus: "idle" | "pending" | "completed" | "declined" | "failed";
  pendingCheckoutId: string | null;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

// Load cart from localStorage
function loadCartFromStorage(): LocalCartItem[] {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.warn("Failed to load cart from localStorage:", error);
    return [];
  }
}

// Save cart to localStorage
function saveCartToStorage(items: LocalCartItem[]): void {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.warn("Failed to save cart to localStorage:", error);
  }
}

// Calculate total quantity
function calculateTotalQuantity(items: LocalCartItem[]): number {
  return items.reduce((total, item) => total + item.quantity, 0);
}

// Calculate total price
function calculateTotalPrice(items: LocalCartItem[]): string {
  const total = items.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0,
  );
  return total.toFixed(2);
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<LocalCartItem[]>([]);
  const [pendingCheckoutId, setPendingCheckoutId] = useState<string | null>(
    null,
  );
  const [checkoutStatus, setCheckoutStatus] = useState<
    "idle" | "pending" | "completed" | "declined" | "failed"
  >("idle");

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedItems = loadCartFromStorage();
    setItems(savedItems);

    // Clear any stuck checkout status on page load
    // This prevents showing "Order Completed" when user returns
    localStorage.removeItem("pendingCheckoutId");
    setPendingCheckoutId(null);
    setCheckoutStatus("idle");
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    saveCartToStorage(items);
  }, [items]);

  // Check pending checkout status
  const checkPendingCheckout = useCallback(async (cartId: string) => {
    try {
      const response = await fetch("/api/checkout/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartId }),
      });

      const result = await response.json();

      if (result.completed) {
        setCheckoutStatus("completed");
        clearCart(); // Clear local cart only after successful checkout
        localStorage.removeItem("pendingCheckoutId");
        setPendingCheckoutId(null);
      } else if (result.status === "expired") {
        setCheckoutStatus("idle"); // Changed from 'expired' to 'idle'
        localStorage.removeItem("pendingCheckoutId");
        setPendingCheckoutId(null);
      }
    } catch (error) {
      console.error("Error checking checkout status:", error);
    }
  }, []);

  // Start checkout process
  const startCheckout = useCallback((cartId: string) => {
    setPendingCheckoutId(cartId);
    setCheckoutStatus("pending");
    localStorage.setItem("pendingCheckoutId", cartId);
  }, []);

  // Cancel checkout
  const cancelCheckout = useCallback(() => {
    setCheckoutStatus("idle");
    localStorage.removeItem("pendingCheckoutId");
    setPendingCheckoutId(null);
  }, []);

  const addItem = useCallback((variant: ProductVariant, product: Product) => {
    // Safety check - if variant or product is invalid, don't add to cart
    if (!variant || !product || !variant.id) {
      console.error("Invalid variant or product data:", { variant, product });
      return;
    }

    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.variantId === variant.id,
      );

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        const updatedItems = [...prevItems];
        const existingItem = updatedItems[existingItemIndex];
        if (existingItem) {
          updatedItems[existingItemIndex] = {
            ...existingItem,
            quantity: existingItem.quantity + 1,
          };
        }
        return updatedItems;
      } else {
        // Add new item
        const newItem: LocalCartItem = {
          id: `${variant.id || "unknown"}-${Date.now()}`,
          variantId: variant.id || "",
          productId: product.id || "",
          title: product.title || "",
          variantTitle: variant.title || "",
          price: variant.price?.amount || "0",
          currency: "USD",
          quantity: 1,
          image: product.featuredImage?.url,
          handle: product.handle || "",
        };
        return [...prevItems, newItem];
      }
    });
  }, []);

  const removeItem = useCallback((variantId: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.variantId !== variantId),
    );
  }, []);

  const updateQuantity = useCallback(
    (variantId: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(variantId);
        return;
      }

      setItems((prevItems) =>
        prevItems.map((item) =>
          item.variantId === variantId ? { ...item, quantity } : item,
        ),
      );
    },
    [removeItem],
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalQuantity = useMemo(() => calculateTotalQuantity(items), [items]);
  const totalPrice = useMemo(() => calculateTotalPrice(items), [items]);

  const value = useMemo(
    () => ({
      items,
      totalQuantity,
      totalPrice,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      startCheckout,
      cancelCheckout,
      setCheckoutStatus,
      checkoutStatus,
      pendingCheckoutId,
    }),
    [
      items,
      totalQuantity,
      totalPrice,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      startCheckout,
      cancelCheckout,
      setCheckoutStatus,
      checkoutStatus,
      pendingCheckoutId,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
