import Footer from "@/components/Footer";
import Navigation from "@/components/marketing/Navigation";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation />
      <main>{children}</main>
      <Footer />
    </>
  );
}
