/* eslint-disable @next/next/no-img-element */
import { getBlogClient } from "@/cms";
import Link from "next/link";
import React from "react";

type Props = {};

const Blog = async (props: Props) => {
  const blog = getBlogClient();
  const posts = await blog.posts.getAll();
  return (
    <div className="mx-auto grid max-w-3xl grid-cols-3 gap-4">
      {posts.map((post) => (
        <div key={post.slug}>
          <Link href={`/blog/${post.slug}`}>
            <img width={284} height={200} src={post.cover_image || ""} alt="" />
            <h3 className="text-lg font-medium">{post.title}</h3>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Blog;
