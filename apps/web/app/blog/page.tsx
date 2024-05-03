/* eslint-disable @next/next/no-img-element */
import { getBlogClient } from "@/cms";
import Link from "next/link";
import React from "react";

type Props = {};

const Blog = async (props: Props) => {
  const blog = getBlogClient();
  // const posts = await blog.posts.list();

  return (
    <>
      <h1 className="my-4 text-2xl font-medium text-zinc-700">Blog</h1>
      <div className="mx-auto grid max-w-3xl grid-cols-3 gap-4">
        {/* {posts.map((post) => (
          <div key={post.slug} className="border bg-white shadow-sm">
            <Link href={`/blog/${post.slug}`}>
              <img
                width={284}
                height={200}
                src={post.cover_image || ""}
                alt=""
              />
              <h3 className="mt-2 px-2 pb-3 text-lg font-medium">
                {post.title}
              </h3>
            </Link>
          </div>
        ))} */}
      </div>
    </>
  );
};

export default Blog;
