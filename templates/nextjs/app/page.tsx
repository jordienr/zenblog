import { createBlog } from "@/zenblog";
import Link from "next/link";

export default async function Home() {
  const blog = createBlog();
  const posts = await blog.posts.list();

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <main className="flex min-h-[500px] flex-col gap-1 p-6">
      {posts.map((post) => (
        <Link
          className="max-w-xs rounded-md p-2 opacity-70 transition-all hover:bg-zinc-50 hover:opacity-100"
          href={`/blog/${post.slug}`}
          key={post.slug}
        >
          <div className="mr-4 text-xs text-slate-400">
            {formatDate(post.published_at)}
          </div>
          <div>{post.title}</div>
          {/* <img
            src={`http://localhost:3000/api/og?title=${post.title}&emoji=✍️&url=Blog`}
            alt=""
          /> */}
        </Link>
      ))}
    </main>
  );
}
