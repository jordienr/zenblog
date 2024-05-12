import Link from "next/link";
import { PropsWithChildren } from "react";
import { getBlog } from "../queries";

export default async function Layout({
  children,
  params,
}: PropsWithChildren<{
  params: { subdomain: string };
}>) {
  const { subdomain } = params;
  const blog = await getBlog(subdomain);

  return (
    <div>
      <main className="min-h-[90vh]">{children}</main>

      <footer className="mt-12 border-t bg-zinc-50">
        <div className="mx-auto flex max-w-xl justify-between gap-3  p-2 py-6 font-mono text-sm tracking-tighter text-zinc-500">
          <Link href="/">{blog?.title}</Link>
          <Link href="https://www.zenblog.com">Zenblog</Link>
        </div>
      </footer>
    </div>
  );
}
