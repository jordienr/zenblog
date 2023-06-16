import AppLayout from "@/layouts/AppLayout";
import { getEnv } from "@/lib/utils/env";
import { createClient } from "@zendoblog/client";

type Props = {
  posts: any;
};
export default function BlogPage({ posts }: Props) {
  return (
    <AppLayout>
      <div className="mx-auto flex max-w-5xl gap-4 px-3">
        {posts.map((post: any) => (
          <div className="w-40 border bg-white p-3 shadow-sm" key={post.slug}>
            <h2 className="text-2xl font-semibold">{post.title}</h2>
            <div>{post.slug}</div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}

export async function getServerSideProps() {
  const env = getEnv();

  const cms = createClient({
    privateKey: env.ZENDO_API_TOKEN,
  });

  const data = await cms.getPosts();

  return {
    props: {
      posts: data,
    },
  };
}
