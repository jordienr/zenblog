import Link from "next/link";

export function Tags({ tags }: { tags: { name: string; slug: string }[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Link
          key={tag.slug}
          href={`/blog/tags/${tag.slug}`}
          className="rounded-md bg-slate-100 px-1.5 py-0.5 text-sm font-medium text-slate-500 transition-all hover:scale-105"
        >
          #{tag.name}
        </Link>
      ))}
    </div>
  );
}
