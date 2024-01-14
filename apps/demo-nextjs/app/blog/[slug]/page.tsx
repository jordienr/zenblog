/* eslint-disable @next/next/no-img-element */
import { getBlog } from "@/zenblog";
import { ContentRenderer } from "@zenblog/react";
import { revalidatePath } from "next/cache";
import Link from "next/link";

export default async function Home({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const blog = getBlog();
  const post = await blog.posts.getBySlug(slug);
  revalidatePath(`/blog/${slug}`);

  return (
    <main className="">
      <img
        className="mx-auto max-w-4xl border"
        src={post.cover_image}
        alt={post.title}
      />
      <div className="prose mx-auto max-w-xl p-4">
        <h1 className="">{post.title}</h1>
        <ContentRenderer content={post.content}></ContentRenderer>
      </div>
    </main>
  );
}
