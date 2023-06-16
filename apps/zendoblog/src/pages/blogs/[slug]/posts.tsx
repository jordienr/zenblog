import Spinner from "@/components/Spinner";
import AppLayout from "@/layouts/AppLayout";
import { createAPIClient } from "@/lib/app/api";
import { Post } from "@/lib/models/posts/Posts";
import { useRouter } from "next/router";
import { IoSettingsSharp } from "react-icons/io5";
import { useQuery } from "react-query";
import { motion } from "framer-motion";
import Link from "next/link";

function StatePill({ published }: { published: Post["published"] }) {
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
  const slug = router.query.slug as string;

  const api = createAPIClient();
  const { isLoading, data, error } = useQuery(["posts", slug], () =>
    api.posts.getAll(slug)
  );

  function getFormattedPosts() {
    if (!data || !data.posts) return [];

    return data.posts.map((post) => {
      return {
        ...post,
        created_at: new Date(post.created_at || "").toLocaleDateString(),
      };
    });
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
                href={`/blogs/${blog.slug}/settings`}
                className="btn btn-icon"
                title="Settings"
                aria-label="Settings"
              >
                <IoSettingsSharp size="24" />
              </Link>

              <Link
                href={`/blogs/${blog.slug}/create`}
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
                  href={`/blogs/${blog.slug}/create`}
                  className="btn btn-primary mx-auto mt-4 max-w-xs"
                >
                  Create your first post
                </Link>
              </div>
            )}
            {getFormattedPosts().map((post) => {
              return (
                <Link
                  href={`/blogs/${slug}/post/${post.slug}`}
                  className="flex items-center justify-between rounded-sm p-3 hover:bg-slate-100/60"
                  key={post.slug}
                >
                  <div>
                    <h2 className="text-lg font-medium">{post.title}</h2>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>{post.created_at}</span>
                      <StatePill published={post.published} />
                    </div>
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
