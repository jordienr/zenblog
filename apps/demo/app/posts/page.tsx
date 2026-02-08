import Link from "next/link";
import { getZenblogClient } from "@/lib/zenblog";

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    tags?: string;
    author?: string;
    limit?: string;
    offset?: string;
    blogId?: string;
  }>;
}) {
  const params = await searchParams;
  const limit = params.limit ? parseInt(params.limit) : 10;
  const offset = params.offset ? parseInt(params.offset) : 0;
  const blogId = params.blogId;

  const zenblog = getZenblogClient(blogId);

  const response = await zenblog.posts.list({
    limit,
    offset,
    category: params.category,
    tags: params.tags?.split(","),
    author: params.author,
    cache: "no-store",
  });

  const posts = response.data;
  const blogIdParam = blogId ? `blogId=${blogId}` : "";
  const withBlogId = (url: string) => {
    if (!blogId) return url;
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}${blogIdParam}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        <div className="text-sm text-gray-500">
          Showing {offset + 1} - {Math.min(offset + limit, response.total)} of{" "}
          {response.total} posts
        </div>
      </div>

      {params.category && (
        <div className="text-sm text-gray-600">
          Filtered by category: <strong>{params.category}</strong>
        </div>
      )}
      {params.tags && (
        <div className="text-sm text-gray-600">
          Filtered by tags: <strong>{params.tags}</strong>
        </div>
      )}
      {params.author && (
        <div className="text-sm text-gray-600">
          Filtered by author: <strong>{params.author}</strong>
        </div>
      )}

      <div className="grid gap-6">
        {posts.map((post) => (
          <div key={post.slug} className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-2">
              <Link
                href={withBlogId(`/posts/${post.slug}`)}
                className="hover:text-blue-600"
              >
                {post.title}
              </Link>
            </h2>
            {post.excerpt && (
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
            )}
            <div className="flex flex-wrap gap-2 mb-3">
              {post.category && (
                <Link
                  href={withBlogId(`/posts?category=${post.category.slug}`)}
                  className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm"
                >
                  {post.category.name}
                </Link>
              )}
              {post.tags.map((tag) => (
                <Link
                  key={tag.slug}
                  href={withBlogId(`/posts?tags=${tag.slug}`)}
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              {post.authors.map((author) => (
                <Link
                  key={author.slug}
                  href={withBlogId(`/authors/${author.slug}`)}
                  className="hover:text-blue-600"
                >
                  By {author.name}
                </Link>
              ))}
              <span>{new Date(post.published_at).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center pt-6">
        {offset > 0 && (
          <Link
            href={withBlogId(
              `/posts?offset=${Math.max(0, offset - limit)}&limit=${limit}${params.category ? `&category=${params.category}` : ""}${params.tags ? `&tags=${params.tags}` : ""}${params.author ? `&author=${params.author}` : ""}`
            )}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Previous
          </Link>
        )}
        {offset + limit < response.total && (
          <Link
            href={withBlogId(
              `/posts?offset=${offset + limit}&limit=${limit}${params.category ? `&category=${params.category}` : ""}${params.tags ? `&tags=${params.tags}` : ""}${params.author ? `&author=${params.author}` : ""}`
            )}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ml-auto"
          >
            Next
          </Link>
        )}
      </div>
    </div>
  );
}
