import Spinner from "@/components/Spinner";
import AppLayout from "@/layouts/AppLayout";
import { createAPIClient } from "@/lib/app/api";
import { useRouter } from "next/router";
import { IoSettingsSharp } from "react-icons/io5";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export function StatePill({ published }: { published: boolean }) {
  const text = published ? "Published" : "Draft";
  if (published) {
    return (
      <span className="rounded-md bg-green-50 px-2 py-1 text-xs font-semibold text-green-500">
        {text}
      </span>
    );
  }
  return (
    <span className="rounded-md bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-500">
      {text}
    </span>
  );
}
export default function BlogPosts() {
  const router = useRouter();
  const blogId = router.query.blogId as string;

  const api = createAPIClient();
  const { isLoading, data, error } = useQuery(["posts", blogId], () =>
    api.posts.getAll(blogId)
  );

  function getFormattedPosts() {
    if (!data || !data.posts) return [];

    const formattedPosts = data.posts.map((post) => {
      return {
        ...post,
        created_at: new Date(post.created_at || "").toLocaleDateString(),
      };
    });

    const sortedPosts = formattedPosts.sort((a, b) => {
      return (
        new Date(b.created_at || "").getTime() -
        new Date(a.created_at || "").getTime()
      );
    });

    return sortedPosts.reverse();
  }

  if (isLoading) {
    return (
      <AppLayout>
        <Spinner />
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="text-center">Something went wrong</div>
      </AppLayout>
    );
  }

  if (data) {
    const { blog, posts } = data;
    return (
      <AppLayout>
        <div className="mx-auto max-w-5xl p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold">
              <span className="mr-2 text-2xl">{blog.emoji}</span>
              {blog.title}
            </h1>
            <div className="flex gap-2">
              <Link
                href={`/blogs/${blog.id}/settings`}
                className="btn btn-icon"
                title="Settings"
                aria-label="Settings"
              >
                <IoSettingsSharp size="24" />
              </Link>

              <Link
                href={`/blogs/${blog.id}/create`}
                className="btn btn-secondary max-w-[120px]"
              >
                New post
              </Link>
            </div>
          </div>

          <div className="mt-4 rounded-xl border bg-white py-2 shadow-sm">
            {getFormattedPosts().length === 0 && (
              <div className="p-12 text-center">
                <span className="font-mono text-lg">Nothing here yet</span>
                <Link
                  href={`/blogs/${blog.id}/create`}
                  className="btn btn-primary mx-auto mt-4 max-w-xs"
                >
                  Create your first post
                </Link>
              </div>
            )}
            {getFormattedPosts().map((post) => {
              return (
                <Link
                  href={`/blogs/${blogId}/post/${post.slug}`}
                  className="flex items-center gap-4 rounded-sm p-3 hover:bg-slate-100/60"
                  key={post.slug}
                >
                  {post.cover_image && (
                    <div>
                      <img
                        src={post.cover_image}
                        className="h-16 w-16 rounded-md object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <h2 className="text-lg font-medium">{post.title}</h2>
                  </div>
                  <StatePill published={post.published} />
                  <div className="ml-auto flex items-center gap-2 text-xs text-slate-500">
                    <span>{post.created_at}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </AppLayout>
    );
  }
}
