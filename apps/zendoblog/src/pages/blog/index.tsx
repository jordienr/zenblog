import AppLayout from "@/layouts/AppLayout";
import { getEnv } from "@/lib/utils/env";
import { createClient, Post } from "@znd/client";
import Link from "next/link";

type Props = {
  posts: Post[]
};
export default function BlogPage({ posts }: Props) {
  return (
    <AppLayout>
      <div className="mt-16 flex flex-col max-w-5xl px-3 bg-white rounded-xl border shadow-sm mx-4">
        {posts.map((post) => (
          <Link
            href={`/blog/${post.slug}`}
          className="bg-white p-3 shadow-sm" key={post.slug}>
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <div className="text-sm text-slate-500">{post.slug}</div>
          </Link>
        ))}
      </div>
    </AppLayout>
  );
}

export async function getServerSideProps() {
  try {
    const env = getEnv();
  
    const cms = createClient({
      blogId: "fc966b9f-419c-4c40-a941-c1122cac8875",
    });
    const data = await cms.getPosts();
    console.log(data);
  
    return {
      props: {
        posts: data,
      }, 
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        posts: [],
      },
    };
  }
}
