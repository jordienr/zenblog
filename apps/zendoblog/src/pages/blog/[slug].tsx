import { ContentRenderer } from "@/components/ContentRenderer";
import AppLayout from "@/layouts/AppLayout";
import { createClient, Post } from "@znd/client";
import { GetServerSidePropsContext } from "next";

type Props = {
  post: Post
};
export default function BlogPostPage({ post }: Props) {
  return (
    <AppLayout>
      <div className="mx-auto flex flex-col max-w-5xl gap-4 px-3">
        <h2>Blog</h2>
        {
            post ? (
                <div className=" bg-white p-3 shadow-sm" key={post.slug}>
                    <h2 className="text-2xl font-semibold">{post.title}</h2>
                    <div>{post.slug}</div>

                    <ContentRenderer content={JSON.parse(post.content)} />
                </div>
            ) : (
                <div className=" bg-white p-3 shadow-sm">
                    not found
                </div>
            )

        }
          </div>
    </AppLayout>
  );
}

export async function getServerSideProps({req, res, params}: GetServerSidePropsContext) {
  try {
    const slug = params?.slug as string
    if (!slug) {
        return {
            props: {
                post: null
            }
        }
    }
    const cms = createClient({
      blogId: "fc966b9f-419c-4c40-a941-c1122cac8875",
    });
    const data = await cms.getPost(slug);
  
    return {
      props: {
        post: data,
      }, 
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        post: [],
      },
    };
  }
}
