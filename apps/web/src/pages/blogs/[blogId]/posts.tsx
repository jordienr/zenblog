/* eslint-disable @next/next/no-img-element */
import AppLayout, { Section } from "@/layouts/AppLayout";
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ImageIcon, MoreVertical, Plus, Trash } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { toast } from "sonner";
import { usePostsQuery } from "@/queries/posts";
import { useBlogQuery } from "@/queries/blogs";
import { formatDate } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuthors, useAuthorsQuery } from "@/queries/authors";

export function StatePill({ published }: { published: boolean }) {
  const text = published ? "Published" : "Draft";
  if (published) {
    return (
      <span className="rounded-md border border-green-200 bg-green-50 px-2 py-1 text-xs font-semibold text-green-500">
        {text}
      </span>
    );
  }
  return (
    <span className="rounded-md border border-orange-200 bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-500">
      {text}
    </span>
  );
}
export default function BlogPosts() {
  const router = useRouter();
  const blogId = router.query.blogId as string;

  const { data: blog, isLoading: blogLoading } = useBlogQuery(blogId);
  const [sortBy, setSortBy] = useState<"created" | "published">("created");

  const POST_PAGE_SIZE = 15;
  const {
    data: posts,
    isLoading: postsLoading,
    fetchNextPage,
  } = usePostsQuery({
    pageSize: POST_PAGE_SIZE,
    sortBy,
  });

  const isLoading = blogLoading || postsLoading;

  const supabase = createSupabaseBrowserClient();
  const queryClient = useQueryClient();

  const deletePostMutation = useMutation({
    mutationFn: async (postSlug: string) => {
      const { data, error } = await supabase
        .from("posts")
        .delete()
        .eq("slug", postSlug);

      if (error) {
        throw error;
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const noPosts = posts?.pages.flatMap((page) => page).length === 0;

  const authors = useAuthors({
    blogId,
  });

  const getAuthorsByIds = (ids: number[]) => {
    if (!authors?.data) return [];
    return authors?.data?.filter((author) => ids.includes(author.id));
  };

  if (blog && posts) {
    return (
      <AppLayout
        loading={isLoading}
        title={
          <div className="flex items-center gap-4">
            Posts
            <Select
              value={sortBy}
              onValueChange={(value) =>
                setSortBy(value as "created" | "published")
              }
            >
              <SelectTrigger>
                <span className="mr-1 text-sm font-medium text-slate-500">
                  Sorted by
                </span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="published">Published at</SelectItem>
                <SelectItem value="created">Created at</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
        actions={
          <Button asChild>
            <Link href={`/blogs/${blog.id}/create`}>
              <Plus size="16" />
              New post
            </Link>
          </Button>
        }
      >
        <Section className="overflow-hidden py-0">
          {noPosts && (
            <div className="p-12 py-32 text-center">
              <div className="text-4xl">✏️</div>
              <div className="mt-2 text-lg text-zinc-500">Nothing here yet</div>
              <Button asChild>
                <Link
                  href={`/blogs/${blog.id}/create`}
                  className="mt-4 inline-flex"
                >
                  Write your first post
                </Link>
              </Button>
            </div>
          )}
          {posts.pages
            .flatMap((page) => page)
            .map((post) => {
              return (
                <PostItem
                  key={post?.slug}
                  post={post}
                  blogId={blogId}
                  authors={getAuthorsByIds(post?.authors || [])}
                  onDeleteClick={async () => {
                    const confirmed = window.confirm(
                      "Are you sure you want to delete this post?"
                    );
                    if (!confirmed) return;
                    try {
                      await deletePostMutation.mutateAsync(post?.slug || "");
                      toast.success("Post deleted");
                    } catch (error) {
                      console.error(error);
                      toast.error("Failed to delete post");
                    }
                  }}
                />
              );
            })}
          {posts.pages.flatMap((page) => page).length > 0 && (
            <div className="flex items-center justify-end gap-4 p-4 text-center font-mono text-xs text-zinc-500">
              Showing {posts.pages.flatMap((page) => page).length} posts
              <Button
                size="xs"
                variant="outline"
                onClick={() => {
                  fetchNextPage();
                }}
              >
                Load more
              </Button>
            </div>
          )}
        </Section>
      </AppLayout>
    );
  }
}

function PostItem({
  post,
  blogId,
  onDeleteClick,
  authors,
}: {
  post: any;
  blogId: string;
  onDeleteClick: () => void;
  authors: { slug: string; name: string; image_url: string | null }[];
}) {
  return (
    <Link
      key={post.slug}
      href={`/blogs/${blogId}/post/${post.slug}`}
      className="group flex flex-col justify-between gap-1 border-b border-zinc-200 p-2 transition-all hover:bg-slate-50 md:flex-row md:items-center md:gap-4 md:p-4"
    >
      <div className="flex items-center gap-4">
        <div className="min-h-24 min-w-32 flex-shrink-0 rounded-md border border-zinc-200 bg-zinc-100">
          {post.cover_image ? (
            <img
              src={post.cover_image}
              alt="Cover image"
              className="h-24 w-32 rounded-md bg-zinc-100 object-cover "
            />
          ) : (
            <div className="flex-center h-24 w-32">
              <ImageIcon size="20" className="text-zinc-400" />
            </div>
          )}
        </div>

        <div className="flex w-full flex-col gap-0.5">
          <h2 className="ml-1 md:text-lg">{post.title}</h2>
          <div className="flex items-center gap-2">
            {post.category_name && (
              <Tooltip>
                <TooltipTrigger>
                  <div className="px-1 text-xs font-medium text-orange-500">
                    {post.category_name}
                  </div>
                </TooltipTrigger>
                <TooltipContent>Category</TooltipContent>
              </Tooltip>
            )}
            {post.tags && post.tags.length > 0 && (
              <div className="flex items-center gap-2">
                {post.tags?.map((tag: any) => (
                  <span
                    key={tag}
                    className="px-1 py-0.5 text-xs font-semibold text-zinc-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="p-1">
            {post.authors && post.authors.length > 0 && (
              <div className="flex items-center gap-2">
                {authors.map((author) => (
                  <span
                    key={author.slug}
                    className="flex items-center gap-1 text-xs font-medium text-zinc-500"
                  >
                    {author.image_url ? (
                      <img
                        src={author.image_url || ""}
                        alt={author.name}
                        width={32}
                        height={32}
                        className="h-5 w-5 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-5 w-5 rounded-full bg-zinc-200"></div>
                    )}
                    {author.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-4 justify-self-end">
        <div className="ml-auto flex items-center gap-2 text-xs text-zinc-500">
          <Tooltip>
            <TooltipTrigger>
              <span className="min-w-fit text-right">
                {formatDate(post.published_at || "")}
              </span>
            </TooltipTrigger>
            <TooltipContent>Published at</TooltipContent>
          </Tooltip>
          <StatePill published={post.published || false} />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={"ghost"}
              size={"icon"}
              onClick={(e) => {
                e.stopPropagation();
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
                onDeleteClick();
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
}
