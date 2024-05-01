import "./globals.css";

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
