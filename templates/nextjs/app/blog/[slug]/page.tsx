/* eslint-disable @next/next/no-img-element */
import { createBlog } from "@/zenblog";
import { revalidatePath } from "next/cache";
import Link from "next/link";

export default async function Home({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const blog = createBlog();
  const post = await blog.posts.get({ slug });
  revalidatePath(`/blog/${slug}`);

  return (
    <main className="">
      {post.cover_image && (
        <img
          className="max-w-4xl border p-8"
          src={post.cover_image}
          alt={post.title}
        />
      )}
      <div className="prose max-w-xl p-8">
        <Link className="text-xs font-medium text-blue-500 underline" href="/">
          Back to blog
        </Link>
        <h1 className="text-xl font-normal">{post.title}</h1>
        <pre>{JSON.stringify(post.content)}</pre>
      </div>
    </main>
  );
}
