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
    .select("title, emoji, description")
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
      <div className="mb-8 grid p-2">
        <h2 className="flex flex-col gap-2 font-medium">
          <span className="text-xl">{blog?.emoji}</span>
          <span className="text-lg">{blog?.title}</span>
        </h2>
        {blog?.description && (
          <p className="font-mono text-sm text-zinc-500">{blog?.description}</p>
        )}
      </div>

      {posts.data?.length === 0 && (
        <>
          <div className="">
            <h2 className="font-medium">No posts yet</h2>
            <p className="font-mono text-slate-500">
              Check back later, see you soon!
            </p>
          </div>
        </>
      )}

      {posts.data?.map((post) => (
        <Link
          className="group flex flex-wrap gap-2 rounded-lg border-b border-transparent p-2 transition-all hover:bg-zinc-50"
          key={post.slug}
          href={`/blog/${post.slug}`}
        >
          <span className="font-medium group-hover:text-orange-500">
            {post.title}
          </span>
          <span>opinion</span>
          <span className="ml-auto text-right font-mono tracking-tight text-slate-400">
            {formatDate(post.published_at)}
          </span>
        </Link>
      ))}
    </div>
  );
}

export default HostedBlog;
