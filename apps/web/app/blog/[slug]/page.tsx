/* eslint-disable @next/next/no-img-element */
import { getBlogClient } from "@/cms";
import React from "react";

const Post = async ({ params: { slug } }: { params: { slug: string } }) => {
  const blog = getBlogClient();
  const { data: post } = await blog.posts.get({ slug });

  return (
    <div>
      <div className="p-4">
        <h1 className="text-2xl font-medium">{post.title}</h1>
      </div>
      <div className="p-2">
        {post.cover_image && (
          <img
            src={post.cover_image}
            height="400"
            width={(16 / 9) * 400}
            loading="lazy"
            alt={post.title}
          />
        )}
      </div>
      <div className="overflow-auto p-4">
        <div
          dangerouslySetInnerHTML={{ __html: post.html_content }}
          className="prose"
        ></div>
      </div>
    </div>
  );
};

export default Post;
