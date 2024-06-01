/* eslint-disable @next/next/no-img-element */
import { Blog, Post } from "app/types";
import { FadeIn } from "app/ui/fade-in";
import { formatPostDate } from "app/utils/dates";
import Link from "next/link";

export function DirectoryHome({
  blog,
  posts,
  disableLinks,
}: {
  blog: Blog;
  posts: Post[];
  disableLinks?: boolean;
}) {
  return (
    <div className="min-h-screen tracking-tight">
      <div className="mx-auto max-w-4xl p-3 py-12">
        <h2 className="inline rounded-full bg-white font-mono text-sm font-medium text-orange-500">
          {blog.title}
        </h2>
        <h1 className="mt-2 text-3xl font-medium">{blog.description}</h1>
      </div>
      <div className="mx-auto grid max-w-5xl grid-cols-3 gap-6 px-3">
        {posts.map((post, idx) => (
          <FadeIn key={post.slug} delay={idx * 0.1}>
            <Link
              href={disableLinks ? "#" : `/${post.slug}`}
              className="group block rounded-lg"
            >
              {post.cover_image ? (
                <div className="overflow-hidden rounded-md">
                  <img
                    width={300}
                    height={300}
                    className="mx-auto h-[240px] w-full rounded-md border bg-white object-cover transition-all  group-hover:opacity-80"
                    src={post.cover_image}
                    alt={post.title}
                  />
                </div>
              ) : (
                <div className="flex h-[240px] w-full items-center justify-center bg-zinc-50 text-2xl">
                  ⛩️
                </div>
              )}
              <div className="px-3 py-1.5 ">
                <h3 className="font-medium group-hover:text-orange-500">
                  {post.title}
                </h3>
                <p className="font-mono text-xs text-zinc-500">
                  {formatPostDate(post.published_at)}
                </p>
              </div>
            </Link>
          </FadeIn>
        ))}
      </div>
      <footer className="mx-auto mt-12 max-w-4xl border-t py-6 text-center font-mono text-sm text-stone-500">
        Powered by zenblog
      </footer>
    </div>
  );
}
