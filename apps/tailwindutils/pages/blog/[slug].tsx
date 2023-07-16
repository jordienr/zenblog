import { getCMS } from "@/zendo";
import { ContentRenderer } from "@zendo/ui";
import Link from "next/link";

export default function BlogPost({ posts }: any) {
  return (
    <main>
      <Link href="/">↩ All utils</Link>
      <h1 className="my-5 text-2xl font-bold">{posts.title}</h1>
      {/* <pre>{JSON.stringify(posts, null, 2)}</pre> */}
      <article className="prose">
        <ContentRenderer content={posts.content} />
      </article>
    </main>
  );
}
export async function getServerSideProps(ctx: any) {
  const cms = getCMS();
  const slug = ctx.query.slug as string;
  const data = await cms.posts.getBySlug(slug);

  return {
    props: {
      posts: data,
    },
  };
}
