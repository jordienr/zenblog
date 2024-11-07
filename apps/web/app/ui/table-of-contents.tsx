"use client";

import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";

type Props = {
  items: {
    title: string;
    href: string;
  }[];
};

export function TableOfContents({ items }: Props) {
  const pathname = usePathname();
  function isActive(href: string) {
    return pathname?.includes(href) ?? false;
  }

  return (
    <div className="w-full min-w-[240px] max-w-[240px] p-4 text-sm">
      <h2 className="font-medium">On this page</h2>
      <ul className="mt-2">
        {items.map((item) => (
          <li key={item.href}>
            <a
              href={`#${item.href}`}
              className={cn("block flex items-center gap-2 p-1", {
                "text-blue-500": isActive(item.href),
              })}
            >
              <ChevronRight className="h-4 w-4 text-slate-400" />
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
