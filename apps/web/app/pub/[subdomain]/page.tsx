import { FadeIn } from "app/ui/fade-in";
import Link from "next/link";
import React from "react";
import { getBlog, getPosts } from "../queries";
import { Metadata } from "next";

export async function generateMetadata({
  params: { subdomain },
}: {
  params: { subdomain: string };
}): Promise<Metadata> {
  const blog = await getBlog(subdomain);

  return {
    title: `${blog?.title}` || "A zenblog blog",
    icons: {
      icon:
        `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${blog?.emoji}</text></svg>` ||
        `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎑</text></svg>`,
    },
    description: blog?.description || "Start writing your blog today",
    openGraph: {
      title: `${blog?.title} - Zenblog` || "A zenblog blog",
      description: blog?.description || "Start writing your blog today",
      type: "website",
    },
  };
}

async function HostedBlog({
  params: { subdomain },
}: {
  params: { subdomain: string };
}) {
  const blog = await getBlog(subdomain);
  const posts = await getPosts(subdomain, blog?.order);

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

      {posts?.length === 0 && (
        <>
          <div className="">
            <h2 className="font-medium">No posts yet</h2>
            <p className="font-mono text-slate-500">
              Check back later, see you soon!
            </p>
          </div>
        </>
      )}

      <div className="divide-y sm:divide-y-0">
        {posts?.map((post, index) => (
          <FadeIn delay={index * 0.05} key={post.slug}>
            <Link
              className="group grid flex-wrap items-center gap-2 p-2 transition-all hover:bg-zinc-50 sm:flex sm:rounded-lg"
              key={post.slug}
              href={`/${post.slug}`}
            >
              <span className="text-zinc-800 group-hover:text-zinc-950">
                {post.title}
              </span>
              <span className="ml-auto text-right font-mono text-xs tracking-tight text-slate-400 sm:text-sm">
                {formatDate(post.published_at)}
              </span>
            </Link>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}

export default HostedBlog;
