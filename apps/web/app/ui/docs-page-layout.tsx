import { TableOfContents } from "./table-of-contents";

export function DocsPageLayout({
  children,
  tocItems,
  title,
  description,
}: {
  children: React.ReactNode;
  tocItems: { title: string; href: string }[];
  title: string;
  description: string;
}) {
  return (
    <div className="relative flex">
      <main className="max-w-full px-6">
        <header>
          <h1 className="text-4xl font-semibold">{title}</h1>
          <p className="mt-4 text-balance">{description}</p>
        </header>
        {children}
      </main>
      <div className="hidden md:block">
        <div className="sticky top-[84px] min-w-[240px] flex-col px-4 md:flex">
          <TableOfContents items={tocItems} />
        </div>
      </div>
    </div>
  );
}
