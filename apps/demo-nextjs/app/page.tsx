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
    <main className="flex min-h-[500px] flex-col gap-4 p-8">
      {posts.map((post) => (
        <Link
          className="flex items-center gap-4"
          href={`/blog/${post.slug}`}
          key={post.slug}
        >
          <span className="text-slate-400">{formatDate(post.created_at)}</span>
          <span>{post.title}</span>
        </Link>
      ))}
    </main>
  );
}
