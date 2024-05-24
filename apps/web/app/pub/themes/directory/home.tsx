/* eslint-disable @next/next/no-img-element */
import { formatPostDate } from "app/utils/dates";
import Link from "next/link";

export function DirectoryHome({
  blog,
  posts,
}: {
  blog: {
    emoji: string;
    title: string;
    description: string;
  };
  posts: {
    cover_image: any;
    title: string;
    published_at: string;
    slug: string;
  }[];
}) {
  return (
    <div className="min-h-screen bg-zinc-50 tracking-tight">
      <div className="p-3 py-12 text-center">
        <h2 className="inline rounded-full bg-white px-3 py-1 font-mono text-sm lowercase text-zinc-700 shadow-sm">
          {blog.title}
        </h2>
        <h1 className="mt-2 text-3xl font-medium">{blog.description}</h1>
      </div>
      <div className="mx-auto grid max-w-4xl grid-cols-3 gap-1.5 px-3">
        {posts.map((post) => (
          <Link
            href={`/${post.slug}`}
            key={post.slug}
            className="group rounded-xl border bg-white shadow-sm"
          >
            {post.cover_image && (
              <div className="mx-1.5 mt-1.5 overflow-hidden rounded-md">
                <img
                  width={300}
                  height={200}
                  className="mx-auto rounded-md transition-all duration-1000 group-hover:scale-150"
                  src={post.cover_image}
                  alt={post.title}
                />
              </div>
            )}
            <div className="px-3 py-1.5">
              <h3 className="font-medium">{post.title}</h3>
              <p className="font-mono text-xs text-zinc-500">
                {formatPostDate(post.published_at)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
