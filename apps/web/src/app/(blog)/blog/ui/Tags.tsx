import { HashIcon } from "lucide-react";
import Link from "next/link";

export function Tags({ tags }: { tags: { name: string; slug: string }[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Link
          key={tag.slug}
          href={`/blog/tags/${tag.slug}`}
          className="flex items-center rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-sm font-medium tracking-tight text-slate-500 transition-all hover:scale-105"
        >
          <HashIcon className="mr-0.5 h-3 w-3" />
          <span className="-mt-[1px]">{tag.name}</span>
        </Link>
      ))}
    </div>
  );
}
