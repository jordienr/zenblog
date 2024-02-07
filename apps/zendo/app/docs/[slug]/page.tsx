/* eslint-disable @next/next/no-img-element */
import { docs } from "@/cms";
import { ContentRenderer } from "@/cms/ContentRenderer";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import React from "react";

type Props = {};

const Post = async ({ params: { slug } }: { params: { slug: string } }) => {
  const post = await docs.posts.getBySlug(slug);

  return (
    <div>
      <div className="sticky top-0 z-10 flex h-12 items-center  justify-between border-b bg-white/80 px-2 backdrop-blur-md">
        <h1 className="text-lg font-medium">{post.title}</h1>
        <Button variant="ghost" size="icon">
          <Search size={16} />
        </Button>
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
