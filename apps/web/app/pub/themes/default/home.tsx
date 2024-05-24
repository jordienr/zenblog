import { FadeIn } from "app/ui/fade-in";
import Link from "next/link";
import React from "react";

export async function DefaultHome({
  posts,
  blog,
}: {
  posts: {
    title: string;
    published_at: string;
    slug: string;
  }[];
  blog: {
    emoji: string;
    title: string;
    description: string;
  };
}) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="mx-auto max-w-xl px-2 py-8">
      <div className="mb-8 grid p-2">
        <h2 className="flex flex-col gap-2 font-medium">
          <span className="text-xl">{blog?.emoji}</span>
          <span className="text-lg">{blog?.title}</span>
        </h2>
        {blog?.description && (
          <p className="font-mono text-sm text-zinc-500">{blog?.description}</p>
        )}
      </div>

      {posts?.length === 0 && (
        <>
          <div className="">
            <h2 className="font-medium">No posts yet</h2>
            <p className="font-mono text-slate-500">
              Check back later, see you soon!
            </p>
          </div>
        </>
      )}

      <div className="divide-y sm:divide-y-0">
        {posts?.map((post, index) => (
          <FadeIn delay={index * 0.05} key={post.slug}>
            <Link
              className="group grid flex-wrap items-center gap-2 p-2 transition-all hover:bg-zinc-50 sm:flex sm:rounded-lg"
              key={post.slug}
              href={`/${post.slug}`}
            >
              <span className="text-zinc-800 group-hover:text-zinc-950">
                {post.title}
              </span>
              <span className="ml-auto text-right font-mono text-xs tracking-tight text-slate-400 sm:text-sm">
                {formatDate(post.published_at)}
              </span>
            </Link>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
