/* eslint-disable @next/next/no-img-element */
import { sendViewEvent } from "@/analytics";
import { ContentRenderer } from "@/cms/ContentRenderer";
import { getBlog, getPost } from "app/pub/queries";
import { FadeIn } from "app/ui/fade-in";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

export async function generateMetadata({
  params: { subdomain, slug },
}: {
  params: { subdomain: string; slug: string };
}): Promise<Metadata> {
  const { data: blog } = await getBlog(subdomain);
  const post = await getPost(subdomain, slug);

  if (!blog) {
    return {
      title: "A zenblog blog",
      description: "Start writing your blog today",
      openGraph: {
        title: "A zenblog blog",
        description: "Start writing your blog today",
        type: "website",
      },
    };
  }

  return {
    title: `${post?.title} - ${blog?.title}` || "A zenblog blog",
    icons: {
      icon:
        `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${blog?.emoji}</text></svg>` ||
        `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎑</text></svg>`,
    },
    description: blog?.description || "Start writing your blog today",
    openGraph: {
      title: `${post?.title} - ${blog?.title}` || "A zenblog blog",
      description: blog?.description || "Start writing your blog today",
      type: "website",
      images: [
        {
          url: `https://zenblog.com/api/og?title=${post?.title}&emoji=${blog?.emoji}&url=${blog?.title}`,
        },
      ],
    },
  };
}

const Post = async ({
  params: { slug, subdomain },
}: {
  params: { slug: string; subdomain: string };
}) => {
  const { data: blog } = await getBlog(subdomain);
  const post = await getPost(subdomain, slug);

  if (!blog) {
    return;
  }

  sendViewEvent({
    blog_id: blog?.id,
    post_slug: slug,
  });

  if (!post) {
    return <div>Post not found</div>;
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  function getBlogUrl() {
    if (!baseUrl) {
      throw new Error("Missing NEXT_PUBLIC_BASE_URL");
    }
    const url = new URL(baseUrl);
    if (url.hostname.startsWith("www.")) {
      url.hostname = url.hostname.slice(4);
    }
    url.hostname = `${subdomain}.${url.hostname}`;
    return url;
  }

  const url = getBlogUrl();

  return (
    <FadeIn>
      <nav className="mx-auto max-w-xl border-b border-zinc-100 px-4 py-2 text-sm">
        <Link
          href={url}
          className="flex items-center font-medium tracking-tight text-zinc-700"
        >
          <span className="mr-2 text-base">{blog?.emoji}</span>
          {blog?.title}
        </Link>
      </nav>
      <div className="mx-auto max-w-xl py-4">
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
              alt={post.title || "Cover image"}
            />
          )}
        </div>
        <div className="overflow-auto p-4">
          <ContentRenderer content={post.html_content || ""} />
        </div>
      </div>
    </FadeIn>
  );
};

export default Post;
