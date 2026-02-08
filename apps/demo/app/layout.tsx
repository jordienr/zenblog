import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { BlogIdSelector } from "./components/BlogIdSelector";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zenblog API Demo",
  description: "Demo app showcasing the Zenblog API",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center relative">
              <div className="flex space-x-8">
                <Link
                  href="/"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
                >
                  Home
                </Link>
                <Link
                  href="/posts"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Posts
                </Link>
                <Link
                  href="/categories"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Categories
                </Link>
                <Link
                  href="/tags"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Tags
                </Link>
                <Link
                  href="/authors"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Authors
                </Link>
              </div>
              <Suspense fallback={null}>
                <BlogIdSelector />
              </Suspense>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
