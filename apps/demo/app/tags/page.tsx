import Link from "next/link";
import { getZenblogClient } from "@/lib/zenblog";

export default async function TagsPage({
  searchParams,
}: {
  searchParams: Promise<{ blogId?: string }>;
}) {
  const { blogId } = await searchParams;
  const zenblog = getZenblogClient(blogId);
  const withBlogId = (url: string) => {
    if (!blogId) return url;
    return `${url}${url.includes("?") ? "&" : "?"}blogId=${blogId}`;
  };

  const response = await zenblog.tags.list();
  const tags = response.data;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tags</h1>
      <p className="text-gray-600">Browse posts by tag</p>

      <div className="flex flex-wrap gap-3">
        {tags.map((tag) => (
          <Link
            key={tag.slug}
            href={withBlogId(`/posts?tags=${tag.slug}`)}
            className="px-4 py-2 bg-white rounded-lg shadow hover:shadow-lg transition-shadow hover:bg-blue-50"
          >
            <span className="text-gray-700">#{tag.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
