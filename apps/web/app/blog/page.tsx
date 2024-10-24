/* eslint-disable @next/next/no-img-element */
import { getBlogClient } from "@/cms";
import Link from "next/link";
import React from "react";
import { Tags } from "./ui/Tags";

type Props = {};

const Blog = async (props: Props) => {
  const blog = getBlogClient();
  const { data } = await blog.posts.list();

  return (
    <div className="p-4">
      <h1 className="py-8 text-2xl font-semibold text-slate-800">Blog</h1>
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
        {data.map((post) => (
          <Link
            href={`/blog/${post.slug}`}
            key={post.slug}
            className="flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition-all ease-in-out hover:scale-[1.02]"
          >
            <img
              className="h-56 w-full object-cover"
              width={300}
              height={200}
              src={post.cover_image || ""}
              alt=""
            />
            <div className="m-4 flex h-full flex-col">
              {post.category && (
                <Link
                  className="hover:bg-orange-5100 rounded-md px-2 py-1 text-sm font-medium text-orange-400 transition-all hover:text-orange-500"
                  href={`/blog/categories/${post.category?.slug}`}
                >
                  {post.category?.name}
                </Link>
              )}

              <h3 className="px-2 text-lg font-medium">{post.title}</h3>
              <p className="px-2 text-sm text-zinc-500">{post.excerpt}</p>
              <div className="flex h-full items-end justify-end">
                <Tags tags={post.tags} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Blog;
