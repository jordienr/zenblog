/* eslint-disable @next/next/no-img-element */
import AppLayout from "@/layouts/AppLayout";
import { createAPIClient } from "@/lib/http/api";
import { useRouter } from "next/router";
import { IoSettingsSharp } from "react-icons/io5";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MoreVertical, PenLine, PlusIcon, TagIcon, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useImages } from "@/components/Images/Images.queries";
import { useBlogTags } from "@/components/Editor/Editor.queries";
import { usePostsQuery } from "@/queries/posts";
import { useBlogQuery } from "@/queries/blogs";
import { formatDate } from "@/lib/utils";
import { PiGear, PiPencilLine, PiTag, PiTrash } from "react-icons/pi";
import Spinner from "@/components/Spinner";

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
  const { data: blog, isLoading: blogLoading } = useBlogQuery(blogId);
  const { data: posts, isLoading: postsLoading } = usePostsQuery();

  const isLoading = blogLoading || postsLoading;

  const images = useImages(blogId);
  const blogTags = useBlogTags({ blogId });

  const supabase = getSupabaseBrowserClient();

  const deletePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      console.log("deleting post", postId);
      const { data, error } = await supabase
        .from("posts")
        .update({ deleted: true })
        .eq("id", postId);
      if (error) {
        throw error;
      }
    },
  });

  if (blog && posts) {
    return (
      <AppLayout loading={isLoading}>
        <div className="mx-auto mt-4 max-w-5xl p-4">
          <div className="flex items-center justify-between">
            <h1 className="mb-2 text-xl font-semibold">
              <span className="mr-2 text-2xl">{blog.emoji}</span>
              {blog.title}
            </h1>
          </div>

          <Tabs defaultValue={"posts"}>
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
                <TabsTrigger value="tags">Tags</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                <Button asChild size="icon" variant={"ghost"}>
                  <Link
                    href={`/blogs/${blog.id}/settings`}
                    className="btn btn-icon"
                    title="Settings"
                    aria-label="Settings"
                  >
                    <div className="sr-only">Settings</div>
                    <PiGear size="24" />
                  </Link>
                </Button>

                <Button asChild>
                  <Link
                    href={`/blogs/${blog.id}/create`}
                    className="btn btn-secondary max-w-[120px]"
                  >
                    <PiPencilLine size="16" />
                    New post
                  </Link>
                </Button>
              </div>
            </div>
            <TabsContent value="posts">
              <div className="mt-2 rounded-xl border bg-white py-2 shadow-sm">
                {posts.length === 0 && (
                  <div className="p-12 py-32 text-center">
                    <div className="text-2xl">✏️</div>
                    <div className="text-lg text-zinc-500">
                      Nothing here yet
                    </div>
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
                {posts.map((post) => {
                  return (
                    <Link
                      href={`/blogs/${blogId}/post/${post.slug}`}
                      className="flex items-center gap-4 rounded-sm p-3 hover:bg-zinc-100/50"
                      key={post.slug}
                    >
                      {post.cover_image && (
                        <div>
                          <img
                            src={post.cover_image}
                            alt=""
                            className="h-16 w-24 rounded-md object-cover"
                          />
                        </div>
                      )}
                      <div className="flex flex-col gap-0.5">
                        <div>
                          <StatePill published={post.published || false} />
                        </div>
                        <h2 className="ml-1 text-lg font-medium">
                          {post.title}
                        </h2>
                      </div>

                      <div className="ml-auto flex items-center gap-2 text-xs text-zinc-500">
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex items-center gap-2">
                            {post.tags?.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-md bg-zinc-100 px-2 py-1 font-mono text-xs font-semibold text-zinc-600"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <span>{formatDate(post.created_at || "")}</span>
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
                                  await deletePostMutation.mutateAsync(
                                    post.post_id || ""
                                  );
                                  toast.success("Post deleted");
                                } catch (error) {
                                  console.error(error);
                                  toast.error("Failed to delete post");
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
            </TabsContent>
            <TabsContent value="media">
              {images.isLoading && (
                <>
                  <div className="flex-center p-12">
                    <Spinner />
                  </div>
                </>
              )}
              <div className="rounded-xl border bg-white py-2 shadow-sm">
                {images.data?.length === 0 && (
                  <>
                    <div className="p-12 py-32 text-center">
                      <div className="text-2xl">📷</div>
                      <div className="text-lg text-zinc-500">
                        No images uploaded yet
                      </div>
                    </div>
                  </>
                )}
                <div className="flex flex-col gap-2">
                  {images.data?.map((img) => {
                    return (
                      <div key={img.id} className="flex gap-4 px-4">
                        <img
                          className="h-24 w-32 rounded-md object-cover"
                          src={img.url}
                          alt={img.name}
                          height={24}
                          width={80}
                        />
                        <div>
                          <h3 className="font-mono">{img.name}</h3>
                          <p className="mt-1 font-mono text-xs tracking-tighter text-zinc-400">
                            {img.url}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="tags">
              <div className="rounded-xl border bg-white py-2 shadow-sm">
                {blogTags.data?.map((tag) => {
                  return (
                    <div
                      key={tag.id}
                      className="flex items-center gap-1.5 px-4 py-2 font-mono"
                    >
                      <div className="rounded-md text-zinc-400">
                        <PiTag size="16" />
                      </div>
                      <h2>{tag.name}</h2>
                      <p className="text-sm text-zinc-500">/{tag.slug}</p>
                      <div>
                        <Button asChild size="icon" variant={"ghost"}>
                          <Link
                            href={`/blogs/${blogId}/tags/${tag.id}`}
                            className="btn btn-icon"
                            title="Edit tag"
                            aria-label="Edit tag"
                          >
                            <PiPencilLine size="16" />
                          </Link>
                        </Button>
                        <Button asChild size="icon" variant={"ghost"}>
                          <Link
                            href={`/blogs/${blogId}/tags/${tag.id}`}
                            className="btn btn-icon"
                            title="Delete tag"
                            aria-label="Delete tag"
                          >
                            <PiTrash size="16" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </AppLayout>
    );
  }
}
