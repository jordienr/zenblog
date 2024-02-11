import ZendoLogo from "@/components/ZendoLogo";
import "./globals.css";
import Link from "next/link";
import { LoggedInUser } from "@/components/LoggedInUser";
import { FaTwitter } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/marketing/Navigation";
export const metadata = {
  title: "Zenblog blog",
  description: "An open source blogging platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
