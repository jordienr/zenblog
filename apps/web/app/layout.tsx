import { IBM_Plex_Mono, Inter } from "next/font/google";
import "./globals.css";

export const metadata = {
  title: "Zenblog blog",
  description: "An open source blogging platform",
};

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-mono",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${ibmPlexMono.variable} ${inter.variable}`}>
        {children}
      </body>
    </html>
  );
}
