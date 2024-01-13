/* eslint-disable @next/next/no-img-element */
import { getBlog } from "@/zenblog";
import { ContentRenderer } from "@zenblog/react";
import Link from "next/link";

export default async function Home({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const blog = getBlog();

  const post = await blog.posts.getBySlug(slug);

  return (
    <div>
      <nav className="p-4 font-medium">
        <Link href="/">Blog</Link>
      </nav>
      <main className="">
        <img
          className="mx-auto max-w-4xl"
          src={post.cover_image}
          alt={post.title}
        />
        <div className="prose mx-auto max-w-xl">
          <h1 className="my-8 text-3xl font-bold">{post.title}</h1>
          <ContentRenderer content={post.content}></ContentRenderer>
        </div>
      </main>
    </div>
  );
}
