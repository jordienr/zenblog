/* eslint-disable @next/next/no-img-element */
import { getBlogClient } from "@/cms";
import { ContentRenderer } from "@/cms/ContentRenderer";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import React from "react";

type Props = {};

const Post = async ({ params: { slug } }: { params: { slug: string } }) => {
  const blog = getBlogClient();
  const post = await blog.posts.getBySlug(slug);

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
        <ContentRenderer content={post.content} />
      </div>
    </div>
  );
};

export default Post;
