import Link from "next/link";
import { getZenblogClient } from "@/lib/zenblog";

export default async function CategoriesPage({
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

  const response = await zenblog.categories.list();
  const categories = response.data;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Categories</h1>
      <p className="text-gray-600">Browse posts by category</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={withBlogId(`/posts?category=${category.slug}`)}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold text-blue-600">
              {category.name}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
