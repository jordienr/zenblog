import Link from "next/link";
import { getZenblogClient } from "@/lib/zenblog";
import { notFound } from "next/navigation";

export default async function AuthorPage({
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
    const [authorResponse, postsResponse] = await Promise.all([
      zenblog.authors.get({ slug }, { cache: "no-store" }),
      zenblog.posts.list({ author: slug, cache: "no-store" }),
    ]);

    const author = authorResponse.data;
    const posts = postsResponse.data;

    return (
      <div className="max-w-4xl mx-auto">
        <Link
          href={withBlogId("/authors")}
          className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
        >
          ← Back to authors
        </Link>

        <div className="bg-white p-8 rounded-lg shadow mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {author.image_url && (
              <img
                src={author.image_url}
                alt={author.name}
                className="w-32 h-32 rounded-full object-cover"
              />
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{author.name}</h1>
              {author.bio && (
                <p className="text-gray-600 mb-4">{author.bio}</p>
              )}
              <div className="flex gap-4 text-sm">
                {author.twitter_url && (
                  <a
                    href={author.twitter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Twitter
                  </a>
                )}
                {author.website_url && (
                  <a
                    href={author.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4">Posts by {author.name}</h2>
        <div className="grid gap-6">
          {posts.map((post) => (
            <div key={post.slug} className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2">
                <Link
                  href={withBlogId(`/posts/${post.slug}`)}
                  className="hover:text-blue-600"
                >
                  {post.title}
                </Link>
              </h3>
              {post.excerpt && (
                <p className="text-gray-600 mb-3">{post.excerpt}</p>
              )}
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <time>{new Date(post.published_at).toLocaleDateString()}</time>
                {post.category && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                    {post.category.name}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching author:", error);
    notFound();
  }
}
