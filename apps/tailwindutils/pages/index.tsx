import { Post } from "zenblog";
import Link from "next/link";
import { getCMS } from "@/zendo";

export default function Home({ posts }: { posts: Post[] }) {
  function getPostDate(date: string) {
    const d = new Date(date);
    return `${d.getFullYear()}.${d.getMonth()}.${d.getDate()}`;
  }

  return (
    <main className={``}>
      <h2 className="p-2 font-bold">Tailwind Magic</h2>
      <ul className="mt-5 flex min-h-[50vh] w-full flex-col divide-y font-mono">
        {posts.map((p) => (
          <Link
            key={p.slug}
            className="reset group p-2"
            href={`blog/${p.slug}`}
          >
            <span className="text-slate-500">{getPostDate(p.createdAt)}</span>
            <span className="text-slate-300">{" - "}</span>
            <span className="group-hover:text-blue-500 group-hover:underline">
              {p.title}
            </span>
          </Link>
        ))}
      </ul>
    </main>
  );
}

export async function getServerSideProps() {
  const cms = getCMS();
  const data = await cms.posts.getAll();

  return {
    props: {
      posts: data,
    },
  };
}
