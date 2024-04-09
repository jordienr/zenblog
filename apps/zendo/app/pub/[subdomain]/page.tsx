import { createClient } from "../../supa";
import Link from "next/link";
import React from "react";

async function HostedBlog({
  params: { subdomain },
}: {
  params: { subdomain: string };
}) {
  const supa = createClient();
  const { data: blog } = await supa
    .from("blogs")
    .select("title, emoji")
    .eq("slug", subdomain)
    .single();

  const posts = await supa
    .from("public_posts_v1")
    .select("title, slug, published_at")
    .eq("blog_slug", subdomain)
    .eq("published", true);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="mx-auto max-w-xl px-2 py-8">
      <h2 className="mb-4 flex items-center gap-2 p-2 font-medium">
        <span className="text-xl">{blog?.emoji}</span>
        <span>{blog?.title}</span>
      </h2>

      {posts.data?.map((post) => (
        <Link
          className="group grid grid-cols-6 border-b border-transparent p-2 transition-all hover:border-slate-300"
          key={post.slug}
          href={`/blog/${post.slug}`}
        >
          <span className="col-span-2 text-slate-500">
            {formatDate(post.published_at)}
          </span>
          <span className="col-span-4 font-medium group-hover:text-orange-500">
            {post.title}
          </span>
        </Link>
      ))}
    </div>
  );
}

export default HostedBlog;
