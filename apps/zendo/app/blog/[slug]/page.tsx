import { getBlogClient } from "@/cms";
import React from "react";

type Props = {};

const Post = async ({ params: { slug } }: { params: { slug: string } }) => {
  const blog = getBlogClient();
  const post = await blog.posts.getBySlug(slug);

  return <div></div>;
};

export default Post;
