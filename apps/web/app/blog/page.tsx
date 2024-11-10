/* eslint-disable @next/next/no-img-element */
import { getBlogClient } from "@/cms";
import Link from "next/link";
import React from "react";

export const dynamic = "auto";
export const revalidate = 300; // 5 minutes
export const metadata = {};
const Blog = async () => {
  const blog = getBlogClient();
  const { data: posts } = await blog.posts.list();

  const latestPost = posts[0];
  const postsWithoutLatest = posts.slice(1);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="py-8 text-2xl font-semibold text-slate-800">Blog</h1>
      </div>
      <div className="mt-2">
        {latestPost && (
          <Link
            href={`/blog/${latestPost.slug}`}
            className="gap-4 transition-all hover:scale-[1.02] md:flex"
          >
            <img
              className="h-96 w-full rounded-xl object-cover"
              width={300}
              height={200}
              src={latestPost.cover_image || ""}
              alt=""
            />
            <div className="m-1 mt-4 flex h-full flex-col md:m-4">
              <p className="text-sm text-zinc-500">
                <span className="mr-2 font-medium text-orange-600">New!</span>
                {new Date(latestPost.published_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>

              <h3 className="mt-2 text-balance text-2xl font-medium">
                {latestPost.title}
              </h3>
              <p className="mt-2 text-zinc-500">{latestPost.excerpt}</p>
            </div>
          </Link>
        )}
      </div>
      <hr className="my-12" />
      <div className="mx-auto mt-8 grid max-w-5xl gap-8 md:grid-cols-2">
        {postsWithoutLatest.map((post) => (
          <Link
            href={`/blog/${post.slug}`}
            key={post.slug}
            className="flex flex-col overflow-hidden transition-all ease-in-out hover:scale-[1.02]"
          >
            <img
              className="h-72 w-full rounded-xl border object-cover"
              width={300}
              height={200}
              src={post.cover_image || ""}
              alt=""
            />
            <div className="m-1 flex h-full flex-col md:m-4">
              <div className="flex items-center gap-4">
                {post.category && (
                  <Link
                    className="text-sm font-medium text-orange-500"
                    href={`/blog/categories/${post.category?.slug}`}
                  >
                    {post.category?.name}
                  </Link>
                )}
                <p className="text-sm text-zinc-500">
                  {new Date(post.published_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <h3 className="pr-4 text-lg font-medium">{post.title}</h3>
              <p className="text-sm text-zinc-500">{post.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Blog;
