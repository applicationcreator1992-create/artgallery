import { CartProvider } from "components/cart/cart-context";

import Footer from "components/layout/footer";

import WhatsAppButton from "components/contact/whatsapp-button";
import { Navbar } from "components/layout/navbar";

import { Inter } from "next/font/google";

import { baseUrl } from "lib/utils";

import type { ReactNode } from "react";

import { Toaster } from "sonner";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: false,
});

// Inline minimal theme provider
const MinimalThemeProvider = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

const { SITE_NAME } = process.env;

export const metadata = {
  metadataBase: new URL(baseUrl()),
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`,
  },
  description: "Welcome to Hamza Lilya Art Gallery",
  openGraph: {
    title: SITE_NAME,
    description: "Welcome to Hamza Lilya Art Gallery",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Hamza Lilya Art Gallery",
      },
    ],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-neutral-50 text-black selection:bg-teal-300 dark:bg-neutral-900 dark:text-white dark:selection:bg-pink-500 dark:selection:text-white">
        <MinimalThemeProvider>
          <CartProvider>
            <Navbar />
            <main className="min-h-screen">
              {children}
              <Toaster closeButton />
            </main>
            <Footer />
            <WhatsAppButton />
          </CartProvider>
        </MinimalThemeProvider>
      </body>
    </html>
  );
}
