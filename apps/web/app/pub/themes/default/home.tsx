import { Blog } from "app/types";
import { SocialLinks } from "app/ui/SocialLinks";
import { ZenblogFooter } from "app/ui/zenblog-footer";
import React from "react";
import { BlogPostItem } from "./blog-post-item";

export function DefaultHome({
  posts,
  blog,
  disableLinks,
}: {
  posts: {
    title: string;
    slug: string;
    published_at: string;
    cover_image: string;
    excerpt: string;
  }[];
  blog: Blog;
  disableLinks?: boolean;
}) {
  return (
    <div className="mx-auto max-w-xl px-2 py-8">
      <div className="mb-8 grid p-2">
        <h2 className="flex flex-col gap-2 font-medium">
          <span className="text-xl">{blog?.emoji}</span>
          <span className="text-lg text-zinc-800">{blog?.title}</span>
        </h2>
        {blog?.description && (
          <p className="font-mono text-sm text-zinc-500">{blog?.description}</p>
        )}
      </div>

      <SocialLinks
        className="mb-2 mt-2 gap-1 border-b pb-2 font-mono text-xs"
        linkClassName="px-2 py-1 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 transition-all rounded-lg hover:cursor-default"
        links={blog}
      />

      {posts?.length === 0 && (
        <>
          <div className="">
            <h2 className="font-medium">No posts yet</h2>
            <p className="font-mono text-zinc-500">
              Check back later, see you soon!
            </p>
          </div>
        </>
      )}

      <div className="divide-y sm:divide-y-0">
        {posts?.map((post, index) => (
          <BlogPostItem
            key={post.slug}
            post={post}
            index={index}
            disableLinks={disableLinks}
          />
        ))}
      </div>
      <ZenblogFooter />
    </div>
  );
}
