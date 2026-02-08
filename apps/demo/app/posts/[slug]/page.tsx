import Link from "next/link";
import { getZenblogClient } from "@/lib/zenblog";
import { notFound } from "next/navigation";

export default async function PostPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ blogId?: string }>;
}) {
  const { slug } = await params;
  const { blogId } = await searchParams;

  const zenblog = getZenblogClient(blogId);
  const withBlogId = (url: string) => {
    if (!blogId) return url;
    return `${url}?blogId=${blogId}`;
  };

  try {
    const response = await zenblog.posts.get({ slug }, { cache: "no-store" });
    const post = response.data;

    return (
      <div className="max-w-4xl mx-auto">
        <Link
          href={withBlogId("/posts")}
          className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
        >
          ← Back to posts
        </Link>

        <article className="bg-white p-8 rounded-lg shadow">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

          <div className="flex items-center gap-4 mb-6 text-gray-600">
            {post.authors.map((author) => (
              <Link
                key={author.slug}
                href={withBlogId(`/authors/${author.slug}`)}
                className="hover:text-blue-600"
              >
                By {author.name}
              </Link>
            ))}
            <span>•</span>
            <time>{new Date(post.published_at).toLocaleDateString()}</time>
          </div>

          {post.cover_image && (
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-auto rounded-lg mb-6"
            />
          )}

          {post.excerpt && (
            <p className="text-xl text-gray-600 mb-6 italic">
              {post.excerpt}
            </p>
          )}

          <div className="flex flex-wrap gap-2 mb-6">
            {post.category && (
              <Link
                href={withBlogId(`/posts?category=${post.category.slug}`)}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded"
              >
                {post.category.name}
              </Link>
            )}
            {post.tags.map((tag) => (
              <Link
                key={tag.slug}
                href={withBlogId(`/posts?tags=${tag.slug}`)}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded"
              >
                #{tag.name}
              </Link>
            ))}
          </div>

          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.html_content }}
          />
        </article>
      </div>
    );
  } catch (error) {
    console.error("Error fetching post:", error);
    notFound();
  }
}
