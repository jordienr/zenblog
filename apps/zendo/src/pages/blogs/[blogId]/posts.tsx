/* eslint-disable @next/next/no-img-element */
import AppLayout from "@/layouts/AppLayout";
import { createAPIClient } from "@/lib/http/api";
import { useRouter } from "next/router";
import { IoSettingsSharp } from "react-icons/io5";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MoreVertical, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { toast } from "sonner";

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
  const queryClient = useQueryClient();

  const api = createAPIClient();
  const { isLoading, data, error } = useQuery(["posts", blogId], () =>
    api.posts.getAll(blogId)
  );

  const supabase = getSupabaseBrowserClient();

  const deletePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      await supabase.from("posts").update({ deleted: true }).eq("id", postId);
    },
    onMutate: async (postId: string) => {
      await queryClient.cancelQueries(["posts", blogId]);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["posts", blogId]);
    },
  });

  function getFormattedPosts() {
    if (!data || !data.posts) return [];

    const formattedPosts = data.posts.map((post) => {
      return {
        ...post,
        created_at: new Date(post.created_at || "").toLocaleDateString(),
        updated_at: new Date(post.updated_at || "").toLocaleDateString(),
      };
    });

    const sortedPosts = formattedPosts.sort((a, b) => {
      return (
        new Date(b.created_at || "").getTime() -
        new Date(a.created_at || "").getTime()
      );
    });

    return sortedPosts;
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
      <AppLayout loading={isLoading}>
        <div className="mx-auto mt-8 max-w-5xl p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold">
              <span className="mr-2 text-2xl">{blog.emoji}</span>
              {blog.title}
            </h1>
            <div className="flex items-center gap-2">
              <Button asChild size="icon" variant={"ghost"}>
                <Link
                  href={`/blogs/${blog.id}/settings`}
                  className="btn btn-icon"
                  title="Settings"
                  aria-label="Settings"
                >
                  <IoSettingsSharp size="24" />
                </Link>
              </Button>

              <Button asChild>
                <Link
                  href={`/blogs/${blog.id}/create`}
                  className="btn btn-secondary max-w-[120px]"
                >
                  New post
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-4 rounded-xl border bg-white py-2 shadow-sm">
            {getFormattedPosts().length === 0 && (
              <div className="p-12 text-center">
                <div className="text-2xl">✏️</div>
                <div className="text-lg text-slate-500">Nothing here yet</div>
                <Button asChild>
                  <Link
                    href={`/blogs/${blog.id}/create`}
                    className="btn btn-primary mx-auto mt-4 max-w-xs"
                  >
                    Create your first post
                  </Link>
                </Button>
              </div>
            )}
            {getFormattedPosts().map((post) => {
              return (
                <Link
                  href={`/blogs/${blogId}/post/${post.slug}`}
                  className="flex items-center gap-4 rounded-sm p-3 hover:bg-zinc-100/60"
                  key={post.slug}
                >
                  {post.cover_image && (
                    <div>
                      <img
                        src={post.cover_image}
                        alt=""
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant={"ghost"}
                          size={"icon"}
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                          }}
                        >
                          <MoreVertical size="16" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={async (e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            const confirmed = window.confirm(
                              "Are you sure you want to delete this post?"
                            );
                            if (!confirmed) return;
                            try {
                              toast.success("Post deleted");
                              await deletePostMutation.mutateAsync(post.id);
                            } catch (error) {
                              toast.error("Failed to delete post");
                              console.error(error);
                            }
                          }}
                        >
                          <Trash size="16" />
                          <span className="ml-2">Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
