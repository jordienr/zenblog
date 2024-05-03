/* eslint-disable @next/next/no-img-element */
import { sendViewEvent } from "@/analytics";
import { ContentRenderer } from "@/cms/ContentRenderer";
import { createClient } from "app/supa";
import React from "react";

const Post = async ({
  params: { slug, subdomain },
}: {
  params: { slug: string; subdomain: string };
}) => {
  const supa = createClient();

  supa
    .from("blogs")
    .select("id")
    .eq("slug", subdomain)
    .single()
    .then((blogRes) => {
      sendViewEvent({
        blog_id: blogRes.data?.id,
        post_slug: slug,
      });
    });

  const { data: post } = await supa
    .from("public_posts_v1")
    .select("title, content, cover_image")
    .eq("slug", slug)
    .eq("blog_slug", subdomain)
    .single();

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="mx-auto max-w-xl px-2 py-8">
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
