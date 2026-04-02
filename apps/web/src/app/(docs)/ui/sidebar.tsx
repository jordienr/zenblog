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
  className,
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
}) {
  const pathname = usePathname();

  const isActive = pathname?.includes(href);
  return (
    <Link
      href={href}
      className={cn(
        "rounded-md p-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 md:p-1.5 md:px-2",
        isActive && "bg-slate-100 text-slate-900",
        className
      )}
    >
      <div className={cn("flex items-center gap-2")}>{children}</div>
    </Link>
  );
}
