import { getBlogClient } from "@/cms";
import { ContentRenderer } from "@zenblog/react/dist/index";
import React from "react";

type Props = {};

const Post = async ({ params: { slug } }: { params: { slug: string } }) => {
  const blog = getBlogClient();
  const post = await blog.posts.getBySlug(slug);

  return (
    <div>
      <ContentRenderer content={post.content} />
    </div>
  );
};

export default Post;
