/* eslint-disable @next/next/no-img-element */
import AppLayout from "@/layouts/AppLayout";
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  CodeIcon,
  ExternalLink,
  ImageOff,
  MoreVertical,
  Paintbrush,
  Pen,
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
import { usePostsQuery } from "@/queries/posts";
import { useBlogQuery } from "@/queries/blogs";
import { formatDate } from "@/lib/utils";
import { PiTag } from "react-icons/pi";
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
import { usePostViewsQuery } from "@/queries/analytics";
import { IntegrationGuide } from "@/components/integration-guide";
import { getHostedBlogUrl } from "@/utils/get-hosted-blog-url";

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

  const media = useMediaQuery(blogId, {
    enabled: tabValue === "media",
  });
  const deleteMedia = useDeleteMediaMutation();
  const [selectedImages, setSelectedImages] = useState<Image[]>([]);
  const [selectedTag, setSelectedTag] = useState<{
    tag_id: string | null;
    tag_name: string | null;
    slug: string | null;
  }>();

  const tags = useTagsWithUsageQuery(
    { blogId },
    {
      enabled: tabValue === "tags",
    }
  );

  const supabase = getSupabaseBrowserClient();
  const queryClient = useQueryClient();

  const postViews = usePostViewsQuery({
    blog_id: blogId,
  });

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
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const deleteTagMutation = useDeleteTagMutation(blogId);
  const updateTagMutation = useUpdateTagMutation(blogId);

  function getPostViews(slug: string) {
    const post = postViews.data?.find((p: any) => p.post_slug === slug);
    return post?.["count()"] || 0;
  }

  const hostedBlogUrl = getHostedBlogUrl(blog?.slug || "");

  if (blog && posts) {
    return (
      <AppLayout loading={isLoading}>
        <div className="mx-auto mt-4 max-w-5xl p-4">
          <div className="flex items-center justify-between">
            <h1 className="mb-2 flex items-center text-xl">
              <span className="mr-2 text-2xl">{blog.emoji}</span>
              {blog.title}
              <Link
                href={hostedBlogUrl}
                title="Settings"
                target="_blank"
                className="ml-2 p-1.5 text-zinc-500"
              >
                <ExternalLink size="16" />
              </Link>
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
              <div className="flex items-center">
                <Button asChild variant="ghost">
                  <Link href={`/blogs/${blog.id}/customise`} title="New post">
                    <Paintbrush size="24" />
                    Customise
                  </Link>
                </Button>
                {/* <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost">
                      <CodeIcon />
                      Integration
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <IntegrationGuide blogId={blogId} />
                  </DialogContent>
                </Dialog> */}
                <Button asChild variant={"ghost"}>
                  <Link
                    href={`/blogs/${blog.id}/settings`}
                    title="Settings"
                    aria-label="Settings"
                  >
                    <Settings size="24" />
                    Settings
                  </Link>
                </Button>
              </div>
            </div>
            <TabsContent value="posts">
              <TabSection
                title={`${posts.length} Posts`}
                actions={
                  <Button asChild>
                    <Link
                      href={`/blogs/${blog.id}/create`}
                      className="btn btn-secondary max-w-[120px]"
                    >
                      <Plus size="16" />
                      New post
                    </Link>
                  </Button>
                }
              >
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
                    <PostItem
                      showClicks={true}
                      views={getPostViews(post.slug || "")}
                      key={post.post_id}
                      post={post}
                      blogId={blogId}
                      onDeleteClick={async () => {
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
                    />
                  );
                })}
                <div className="px-3 pt-2 text-center font-mono text-xs text-zinc-500">
                  Total posts: {posts.length}
                </div>
              </TabSection>
            </TabsContent>
            <TabsContent value="media">
              <TabSection
                title={
                  selectedImages.length > 0
                    ? `${selectedImages.length} files selected`
                    : "Media"
                }
                actions={
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
                        <Button variant="ghost">
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
                }
              >
                <>
                  {media.isLoading && (
                    <>
                      <div className="flex-center p-12">
                        <Spinner />
                      </div>
                    </>
                  )}

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
                    <div className="mt-3 flex flex-col gap-2 px-3">
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
                </>
              </TabSection>
            </TabsContent>
            <TabsContent value="tags">
              <TabSection
                title={tags.data?.length ? `${tags.data?.length} tags` : "Tags"}
                actions={<CreateTagDialog blogId={blogId} />}
              >
                <>
                  {tags.isLoading && (
                    <div className="p-12">
                      <Spinner />
                    </div>
                  )}
                  {tags.data?.length === 0 && (
                    <div className="p-12 py-32 text-center">
                      <div className="text-2xl">🏷️</div>
                      <div className="text-lg text-zinc-500">
                        Nothing here yet
                      </div>
                    </div>
                  )}

                  <div className="grid divide-y">
                    {tags.data?.length ? (
                      <div className="grid grid-cols-4 items-center p-2 text-sm font-medium text-zinc-600">
                        <div>Tag</div>
                        <div>Slug</div>
                        <div className="text-right">Posts with tag</div>
                        <div></div>
                      </div>
                    ) : null}

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

                          <div className="text-right font-mono">
                            {tag.post_count}
                          </div>

                          <div className="flex items-center justify-end">
                            <DropdownMenu modal={false}>
                              <DropdownMenuTrigger asChild>
                                <Button size="icon" variant={"ghost"}>
                                  <MoreVertical size="16" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem
                                  onClick={() => {
                                    if (!tag) {
                                      return;
                                    }
                                    setSelectedTag(tag);
                                    setUpdateTagDialogOpen(true);
                                  }}
                                >
                                  <Pen size="16" className="mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    if (!tag) {
                                      return;
                                    }
                                    setSelectedTag(tag);
                                    setDeleteTagDialogOpen(true);
                                  }}
                                >
                                  <Trash size="16" className="mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              </TabSection>
            </TabsContent>
          </Tabs>
          <UpdateTagDialog
            tag={selectedTag}
            onSubmit={async (newTag) => {
              if (!newTag.tag_id) return;
              const res = await updateTagMutation.mutateAsync({
                name: newTag.tag_name,
                slug: newTag.slug,
                id: newTag.tag_id,
              });
              if (res.error) {
                toast.error("Failed to update tag");
                return;
              }
              setUpdateTagDialogOpen(false);
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
              if (!selectedTag?.tag_id) return;

              const res = await deleteTagMutation.mutateAsync(
                selectedTag.tag_id
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
      </AppLayout>
    );
  }
}

function PostItem({
  post,
  blogId,
  views,
  onDeleteClick,
  showClicks,
}: {
  post: any;
  blogId: string;
  views: string;
  onDeleteClick: () => void;
  showClicks?: boolean;
}) {
  return (
    <Link
      href={`/blogs/${blogId}/post/${post.slug}`}
      className="flex flex-col gap-4 rounded-sm border-b px-3 py-1.5 ring-orange-300 transition-all hover:bg-zinc-50 md:flex-row md:items-center"
      key={post.slug}
    >
      <div className="hidden h-16 w-24 rounded-md bg-zinc-100 md:block ">
        {post.cover_image ? (
          <img
            src={post.cover_image}
            alt="Cover image"
            className="h-16 w-24 rounded-md bg-zinc-100 object-cover "
          />
        ) : (
          <div className="flex-center h-full">
            <ImageOff size="20" className="text-zinc-400" />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-0.5">
        <div>
          <StatePill published={post.published || false} />
        </div>
        <h2 className="ml-1 text-lg font-normal">{post.title}</h2>
        {showClicks && (
          <span className="px-1 font-mono text-xs text-zinc-500">
            {views ? `${views} clicks` : "0 clicks"}
          </span>
        )}
      </div>

      <div className="ml-auto flex items-center gap-2 text-xs text-zinc-500">
        {post.tags && post.tags.length > 0 && (
          <div className="flex items-center gap-2">
            {post.tags?.map((tag: any) => (
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
              }}
            >
              <MoreVertical size="16" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={async (e) => {
                e.stopPropagation();
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

function TabSection({
  title,
  children,
  actions,
}: {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-white py-2">
      <div className="flex justify-between border-b px-3 py-1 pb-3">
        <h2 className="text-lg font-medium">{title}</h2>
        {actions}
      </div>
      {children}
    </div>
  );
}
