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
  const { data: categories } = await blog.categories.list();

  const latestPost = posts[0];
  const postsWithoutLatest = posts.slice(1);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Blog</h1>
      <p className="text-lg font-medium text-zinc-500">
        Tools and insights to help you grow your business with blogging.
      </p>
      <div className="mt-12">
        {latestPost && (
          <Link
            href={`/blog/${latestPost.slug}`}
            className="group shadow-lg transition-all hover:scale-105 hover:shadow-xl md:flex md:rounded-2xl"
          >
            <img
              className="h-[400px] w-full rounded-t-2xl object-cover md:w-3/5 md:rounded-l-2xl md:rounded-tr-none"
              width={600}
              height={400}
              src={latestPost.cover_image || ""}
              alt=""
            />
            <div className="flex flex-col justify-center rounded-b-2xl border-x border-b bg-zinc-50 p-5 transition-all group-hover:bg-white md:rounded-r-2xl md:rounded-bl-none md:border-t">
              <p className="text-sm text-zinc-500">
                <span className="mr-2 font-medium text-orange-600">New!</span>
                <time>
                  {new Date(latestPost.published_at).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </time>
              </p>

              <h2 className="text-2xl font-medium">{latestPost.title}</h2>
              <p className="mt-1 text-sm text-zinc-500">{latestPost.excerpt}</p>
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
