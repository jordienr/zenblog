/* eslint-disable @next/next/no-img-element */
import AppLayout from "@/layouts/AppLayout";
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Edit,
  MoreVertical,
  Pen,
  Pencil,
  Plus,
  Settings,
  Trash,
  TrashIcon,
  Upload,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useDeleteMediaMutation,
  useMediaQuery,
} from "@/components/Images/Images.queries";
import { useBlogTags } from "@/components/Editor/Editor.queries";
import { usePostsQuery } from "@/queries/posts";
import { useBlogQuery } from "@/queries/blogs";
import { formatDate } from "@/lib/utils";
import { PiTag, PiTrash } from "react-icons/pi";
import Spinner from "@/components/Spinner";
import { useState } from "react";
import { CreateTagDialog } from "@/components/Tags/CreateTagDialog";
import { ConfirmDialog } from "@/components/confirm-dialog";
import {
  useDeleteTagMutation,
  useTagsWithUsageQuery,
  useUpdateTagMutation,
} from "@/queries/tags";
import { UpdateTagDialog } from "@/components/Tags/UpdateTagDialog";
import { Image, ImageSelector } from "@/components/Images/ImagePicker";
import { useRouterTabs } from "@/hooks/useRouterTabs";
import { ImageUploader } from "@/components/Images/ImageUploader";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

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
  const { tabValue, onTabChange } = useRouterTabs("tab");
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [updateTagDialogOpen, setUpdateTagDialogOpen] = useState(false);
  const [deleteTagDialogOpen, setDeleteTagDialogOpen] = useState(false);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);

  const { data: blog, isLoading: blogLoading } = useBlogQuery(blogId);
  const { data: posts, isLoading: postsLoading } = usePostsQuery();

  const isLoading = blogLoading || postsLoading;

  const media = useMediaQuery(blogId);
  const deleteMedia = useDeleteMediaMutation();
  const [selectedImages, setSelectedImages] = useState<Image[]>([]);

  const tags = useTagsWithUsageQuery({ blogId });

  const supabase = getSupabaseBrowserClient();
  const queryClient = useQueryClient();

  const deletePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      const { data, error } = await supabase
        .from("posts")
        .delete()
        .eq("id", postId);

      if (error) {
        throw error;
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });

  const deleteTagMutation = useDeleteTagMutation();
  const updateTagMutation = useUpdateTagMutation();

  if (blog && posts) {
    return (
      <AppLayout loading={isLoading}>
        <div className="mx-auto mt-4 max-w-5xl p-4">
          <div className="flex items-center justify-between">
            <h1 className="mb-2 text-xl">
              <span className="mr-2 text-2xl">{blog.emoji}</span>
              {blog.title}
            </h1>
          </div>

          <Tabs
            value={tabValue || "posts"}
            onValueChange={(tabVal) => {
              onTabChange(tabVal);
            }}
          >
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger onClick={() => {}} value="media">
                  Media
                </TabsTrigger>
                <TabsTrigger onClick={() => {}} value="tags">
                  Tags
                </TabsTrigger>
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
                    <Settings size="24" />
                  </Link>
                </Button>

                <Button asChild>
                  <Link
                    href={`/blogs/${blog.id}/create`}
                    className="btn btn-secondary max-w-[120px]"
                  >
                    <Plus size="16" />
                    New post
                  </Link>
                </Button>
              </div>
            </div>
            <TabsContent value="posts">
              <div className="mt-2 rounded-xl border border-b-2 bg-white py-2">
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
                        Publish your first post
                      </Link>
                    </Button>
                  </div>
                )}
                {posts.map((post) => {
                  return (
                    <Link
                      href={`/blogs/${blogId}/post/${post.slug}`}
                      className="flex items-center gap-4 rounded-sm p-3 ring-orange-300 transition-all  hover:ring-1"
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
                        <h2 className="ml-1 text-lg font-normal">
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
                        <span>{formatDate(post.published_at || "")}</span>
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
              {media.isLoading && (
                <>
                  <div className="flex-center p-12">
                    <Spinner />
                  </div>
                </>
              )}
              <div className="rounded-xl border bg-white py-2 shadow-sm">
                <div className="flex justify-between pr-3">
                  <h2 className="px-3 py-1 text-lg font-medium tracking-tight">
                    {selectedImages.length > 0
                      ? `${selectedImages.length} files selected`
                      : "Media"}
                  </h2>
                  <div className="flex gap-2">
                    {selectedImages.length > 0 && (
                      <>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setConfirmDeleteDialogOpen(true);
                          }}
                        >
                          <TrashIcon size="16" />
                          Delete {selectedImages.length}{" "}
                          {selectedImages.length > 1 ? "files" : "file"}
                        </Button>
                        <ConfirmDialog
                          open={confirmDeleteDialogOpen}
                          onOpenChange={setConfirmDeleteDialogOpen}
                          title="Are you sure you want to delete these files?"
                          description="Blog posts that reference these files will be affected. This action cannot be undone."
                          onConfirm={async () => {
                            const paths = selectedImages.map(
                              (img) => `${blogId}/${img.name}`
                            );
                            const { error, data } =
                              await deleteMedia.mutateAsync(paths);

                            if (error) {
                              toast.error("Failed to delete images");
                              return;
                            }
                            toast.success("Images deleted");
                            setSelectedImages([]);
                          }}
                          dialogBody={
                            <div>
                              <h2 className="font-medium">Files to delete:</h2>
                              <ul className="font-mono text-red-500">
                                {selectedImages.map((img) => (
                                  <li key={img.name}>{img.name}</li>
                                ))}
                              </ul>
                            </div>
                          }
                        />
                      </>
                    )}
                    <Dialog
                      open={showUploadDialog}
                      onOpenChange={setShowUploadDialog}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          <Upload size="16" />
                          Upload
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="md:max-w-sm">
                        <ImageUploader
                          blogId={blogId}
                          onSuccessfulUpload={() => {
                            setShowUploadDialog(false);
                            media.refetch();
                          }}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                {media.isLoading ||
                  (media.isRefetching && (
                    <div className="flex-center p-12">
                      <Spinner />
                    </div>
                  ))}
                {media.data?.length === 0 ? (
                  <>
                    <div className="p-12 py-32 text-center">
                      <div className="text-2xl">📷</div>
                      <div className="text-lg text-zinc-500">
                        No images uploaded yet
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col gap-2 px-2">
                    <ImageSelector
                      images={media.data || []}
                      onChange={(imgs) => {
                        setSelectedImages(imgs);
                      }}
                      selected={selectedImages}
                      type="multiple"
                    />
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="tags">
              <div className="rounded-xl border bg-white px-2 py-2 shadow-sm">
                <div className="flex justify-between">
                  <h2 className="px-3 py-1 text-lg font-medium tracking-tight">
                    {tags.data?.length ? `${tags.data?.length} tags` : "Tags"}
                  </h2>
                  <CreateTagDialog blogId={blogId} />
                </div>
                {tags.data?.length === 0 && (
                  <div className="p-12 py-32 text-center">
                    <div className="text-2xl">🏷️</div>
                    <div className="text-lg text-zinc-500">
                      Nothing here yet
                    </div>
                  </div>
                )}

                <div className="grid divide-y">
                  {tags.data?.length && (
                    <div className="grid grid-cols-4 items-center p-2 text-sm font-medium text-zinc-600">
                      <div>Tag</div>
                      <div>Slug</div>
                      <div>Posts with tag</div>
                      <div></div>
                    </div>
                  )}

                  {tags.data?.map((tag) => {
                    return (
                      <div
                        key={tag.tag_id}
                        className="grid grid-cols-4 items-center px-2 py-1.5 hover:bg-zinc-50"
                      >
                        <div className="flex items-center gap-2">
                          <PiTag className="text-orange-500" size="16" />
                          <span className="font-medium">{tag.tag_name}</span>
                        </div>

                        <div className="flex flex-col">
                          <p className="font-mono text-sm text-zinc-500">
                            {tag.slug}
                          </p>
                        </div>

                        <div className="font-mono">{tag.post_count}</div>

                        <div className="flex items-center justify-end">
                          <DropdownMenu modal={false}>
                            <DropdownMenuTrigger>
                              <Button size="icon" variant={"ghost"}>
                                <MoreVertical size="16" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem
                                onClick={() => {
                                  setUpdateTagDialogOpen(true);
                                }}
                              >
                                <Pen size="16" className="mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setDeleteTagDialogOpen(true);
                                }}
                              >
                                <Trash size="16" className="mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <UpdateTagDialog
                          tag={tag}
                          onSubmit={async (newTag) => {
                            const res = await updateTagMutation.mutateAsync({
                              name: newTag.tag_name,
                              slug: newTag.slug,
                              id: tag.tag_id!,
                            });
                            if (res.error) {
                              toast.error("Failed to update tag");
                              return;
                            }
                            toast.success("Tag updated");
                          }}
                          open={updateTagDialogOpen}
                          onOpenChange={setUpdateTagDialogOpen}
                        />
                        <ConfirmDialog
                          title="Delete tag"
                          description="Are you sure you want to delete this tag? This action cannot be undone."
                          open={deleteTagDialogOpen}
                          onOpenChange={setDeleteTagDialogOpen}
                          onConfirm={async () => {
                            const res = await deleteTagMutation.mutateAsync(
                              tag.tag_id!
                            );
                            if (res.error) {
                              toast.error("Failed to delete tag");
                              return;
                            }
                            setDeleteTagDialogOpen(false);
                            toast.success("Tag deleted");
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </AppLayout>
    );
  }
}
