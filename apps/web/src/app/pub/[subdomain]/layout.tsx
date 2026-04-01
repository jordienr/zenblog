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
  const { data: blog } = await getBlog(subdomain);

  return (
    <div>
      <main className="min-h-[90vh]">{children}</main>
    </div>
  );
}
