/* eslint-disable @next/next/no-img-element */
import { getBlogClient } from "@/cms";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

export const dynamic = "auto";
type Params = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: Params) {
  const blog = getBlogClient();
  const { data: post } = await blog.posts.get({ slug: params.slug });

  return {
    title: post.title,
    description: post.excerpt,
  };
}
const Post = async ({ params: { slug } }: Params) => {
  const blog = getBlogClient();
  const { data: post } = await blog.posts.get({ slug });

  return (
    <div>
      <div className="prose mx-auto">
        <Link href="/blog" className="flex items-center gap-2">
          <ArrowLeftIcon className="h-4 w-4" />
          All posts
        </Link>
        <p className="text-center text-zinc-500">
          {new Date(post.published_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <h1 className="text-balance text-center text-5xl font-semibold">
          {post.title}
        </h1>
      </div>
      <div className="prose mx-auto p-4">
        <div>
          {post.cover_image && (
            <img
              src={post.cover_image}
              height="400"
              width={(16 / 9) * 400}
              loading="lazy"
              alt={post.title}
              className="rounded-xl border"
            />
          )}
        </div>
        <div>
          <div
            dangerouslySetInnerHTML={{ __html: post.html_content }}
            className="prose mx-auto"
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Post;
