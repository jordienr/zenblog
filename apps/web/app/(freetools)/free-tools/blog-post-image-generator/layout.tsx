import type React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zenblog - Create Free Beautiful Blog Post Images",
  description:
    "Generate stunning Open Graph images for your blog posts with customizable templates, colors, and fonts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>{children}</div>;
}
