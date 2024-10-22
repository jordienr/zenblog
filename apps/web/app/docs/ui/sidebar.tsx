"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SidebarTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={cn(
        "mt-4 py-2 text-sm font-semibold text-slate-900",
        className
      )}
    >
      {children}
    </h3>
  );
}

export function SidebarLink({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  const pathname = usePathname();

  const isActive = pathname?.includes(href);
  return (
    <Link
      href={href}
      className={cn(
        "border-l border-slate-200 p-1.5 px-3 text-sm font-medium text-slate-700 hover:border-orange-500 hover:text-slate-900",
        isActive && "border-orange-500 text-slate-900"
      )}
    >
      {children}
    </Link>
  );
}
