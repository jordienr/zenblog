import { Blog, Post } from "app/types";
import { FadeIn } from "app/ui/fade-in";
import { ZenblogFooter } from "app/ui/zenblog-footer";
import { formatPostDate } from "app/utils/dates";
import Link from "next/link";
import React from "react";

export function DefaultHome({
  posts,
  blog,
  disableLinks,
}: {
  posts: Post[];
  blog: Blog;
  disableLinks?: boolean;
}) {
  return (
    <div className="mx-auto max-w-xl px-2 py-8">
      <div className="mb-8 grid p-2">
        <h2 className="flex flex-col gap-2 font-medium">
          <span className="text-xl">{blog?.emoji}</span>
          <span className="text-lg text-zinc-800">{blog?.title}</span>
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
              className="group grid p-2 transition-all hover:bg-zinc-50 sm:rounded-lg"
              key={post.slug}
              href={disableLinks ? "#" : `/${post.slug}`}
            >
              <div className="grid flex-wrap items-center justify-between sm:flex">
                <span className="text-zinc-700 group-hover:text-zinc-950">
                  {post.title}
                </span>
                <span className="font-mono text-xs tracking-tight text-zinc-400">
                  {formatPostDate(post.published_at)}
                </span>
              </div>
              {post.abstract && (
                <p className="font-mono text-xs text-zinc-500">
                  {post.abstract}
                </p>
              )}
            </Link>
          </FadeIn>
        ))}
      </div>
      <ZenblogFooter />
    </div>
  );
}
