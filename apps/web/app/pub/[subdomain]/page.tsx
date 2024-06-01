import React from "react";
import { getBlog, getPosts } from "../queries";
import { Metadata } from "next";
import { BlogHomePage } from "../themes/blog-home";
import { Theme } from "app/types";

export async function generateMetadata({
  params: { subdomain },
}: {
  params: { subdomain: string };
}): Promise<Metadata> {
  const { data: blog } = await getBlog(subdomain);

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
  const { data: blog, error: blogError } = await getBlog(subdomain);
  const { data: posts, error: postsError } = await getPosts(
    subdomain,
    blog?.order
  );

  if (blogError || postsError) {
    return (
      <div className="flex-center p-12">
        <h1>Blog not found</h1>
      </div>
    );
  }

  return <BlogHomePage theme={blog.theme as Theme} blog={blog} posts={posts} />;
}

export default HostedBlog;
