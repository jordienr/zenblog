import { getBlog } from "@/zenblog";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const blog = getBlog();
  const posts = await blog.posts.getAll();

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString();
  };

  return (
    <main className="flex flex-col gap-4 p-8">
      {posts.map((post) => (
        <Link
          className="text-lg font-medium underline"
          href={`/blog/${post.slug}`}
          key={post.slug}
        >
          {post.title} · {formatDate(post.created_at)}
        </Link>
      ))}
    </main>
  );
}
