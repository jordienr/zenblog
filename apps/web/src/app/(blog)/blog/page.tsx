/* eslint-disable @next/next/no-img-element */
import { getBlogClient } from "@/cms";
import Link from "next/link";
import React from "react";

export const dynamic = "force-dynamic";
export const revalidate = 300; // 5 minutes
export const metadata = {};

const Blog = async () => {
  const blog = getBlogClient();
  const { data: posts } = await blog.posts.list();

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
            className="group transition-all hover:scale-105 md:flex"
          >
            <img
              className="h-[400px] w-full rounded-2xl object-cover md:w-3/5"
              width={600}
              height={400}
              src={latestPost.cover_image || ""}
              alt=""
            />
            <div className="flex w-full flex-col justify-center p-5 pb-8 transition-all">
              <p className="w-full text-sm text-zinc-500">
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

              <h2 className="text-2xl font-medium md:text-3xl">
                {latestPost.title}
              </h2>
              <p className="mt-1 text-sm text-zinc-500">{latestPost.excerpt}</p>

              <div className="mt-4 flex items-center gap-2">
                {latestPost.authors?.map((author) => (
                  <div className="flex items-center gap-2" key={author.slug}>
                    <img
                      className="h-8 w-8 rounded-full object-cover"
                      src={author.image_url || ""}
                      alt={author.name}
                      width={40}
                      height={40}
                    />
                    <p className="font-medium text-slate-500">{author.name}</p>
                  </div>
                ))}
              </div>
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
