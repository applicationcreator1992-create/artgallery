"use client";

import { useCart } from "components/cart/cart-context";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const Header = () => {
  const [productsDropdown, setProductsDropdown] = useState(false);
  const [aboutDropdown, setAboutDropdown] = useState(false);
  const { totalQuantity } = useCart();

  const headerRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setProductsDropdown(false);
        setAboutDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleProductsDropdown = () => {
    setProductsDropdown(!productsDropdown);
    setAboutDropdown(false); // Close other dropdown
  };

  const toggleAboutDropdown = () => {
    setAboutDropdown(!aboutDropdown);
    setProductsDropdown(false); // Close other dropdown
  };

  return (
    <>
      <header ref={headerRef} className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link
                href="/"
                className="flex items-center space-x-2"
                prefetch={true}
              >
                <img
                  src="/images/logos/logo-lilya.png"
                  alt="LilyaArt Logo"
                  className="h-16 w-auto"
                />
                <span className="text-xl font-bold text-gray-900">
                  LilyaArt
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {/* Home */}
              <Link
                href="/"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
                prefetch={true}
              >
                Home
              </Link>

              {/* Products Dropdown */}
              <div className="relative">
                <button
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors flex items-center space-x-1"
                  onClick={toggleProductsDropdown}
                >
                  <span>Products</span>
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {productsDropdown && (
                  <div className="absolute left-0 top-full w-48 bg-white shadow-lg rounded-md py-2 mt-1">
                    <Link
                      href="/"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      prefetch={true}
                    >
                      Collections
                    </Link>
                    <Link
                      href="/"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      prefetch={true}
                    >
                      Artists
                    </Link>
                  </div>
                )}
              </div>

              {/* About Dropdown */}
              <div className="relative">
                <button
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors flex items-center space-x-1"
                  onClick={toggleAboutDropdown}
                >
                  <span>About</span>
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {aboutDropdown && (
                  <div className="absolute left-0 top-full w-48 bg-white shadow-lg rounded-md py-2 mt-1">
                    <Link
                      href="/exhibitions"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      prefetch={true}
                    >
                      Exhibitions
                    </Link>
                    <Link
                      href="/faq"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      prefetch={true}
                    >
                      FAQ
                    </Link>
                    <Link
                      href="/contact"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      prefetch={true}
                    >
                      Contact Us
                    </Link>
                    <Link
                      href="/shipping"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      prefetch={true}
                    >
                      Shipping & Returns
                    </Link>
                  </div>
                )}
              </div>
            </nav>

            {/* Right side - Cart */}
            <div className="flex items-center space-x-4">
              {/* Cart Icon */}
              <Link
                href="/cart"
                className="text-gray-700 hover:text-gray-900 p-2 rounded-md transition-colors relative"
                prefetch={true}
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
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {totalQuantity > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                    {totalQuantity}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
