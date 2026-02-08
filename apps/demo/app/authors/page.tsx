import Link from "next/link";
import { getZenblogClient } from "@/lib/zenblog";

export default async function AuthorsPage({
  searchParams,
}: {
  searchParams: Promise<{ blogId?: string }>;
}) {
  const { blogId } = await searchParams;
  const zenblog = getZenblogClient(blogId);
  const withBlogId = (url: string) => {
    if (!blogId) return url;
    return `${url}?blogId=${blogId}`;
  };

  const response = await zenblog.authors.list();
  const authors = response.data;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Authors</h1>
      <p className="text-gray-600">Browse all blog authors</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {authors.map((author) => (
          <Link
            key={author.slug}
            href={withBlogId(`/authors/${author.slug}`)}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            {author.image_url && (
              <img
                src={author.image_url}
                alt={author.name}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
            )}
            <h2 className="text-xl font-semibold text-center mb-2">
              {author.name}
            </h2>
            {author.bio && (
              <p className="text-gray-600 text-sm text-center line-clamp-3">
                {author.bio}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
