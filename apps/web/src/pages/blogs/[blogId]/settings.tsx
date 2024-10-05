import AppLayout from "@/layouts/AppLayout";
import { useRouter } from "next/router";
import { Controller, useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { EmojiPicker } from "@/components/EmojiPicker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  useBlogQuery,
  useDeleteBlogMutation,
  useUpdateBlogMutation,
} from "@/queries/blogs";
import { AlertCircle, ExternalLink, Info } from "lucide-react";
import Link from "next/link";
import { getHostedBlogUrl } from "@/utils/get-hosted-blog-url";
import { Textarea } from "@/components/ui/textarea";
import { createId } from "@/lib/create-id";
import { API } from "app/utils/api-client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";

export default function BlogSettings() {
  type FormData = {
    title: string;
    description: string;
    emoji: string;
    slug: string;
  };

  const {
    register,
    handleSubmit,
    formState: { isDirty },
    reset,
    control,
  } = useForm<FormData>();
  const router = useRouter();
  const blogId = router.query.blogId as string;

  const {
    isLoading: blogLoading,
    data: blog,
    error: blogError,
    refetch: refetchBlog,
  } = useBlogQuery(blogId);

  const updateBlog = useUpdateBlogMutation();

  const onSubmit = handleSubmit(async (formData) => {
    try {
      console.log(formData);
      const res = await updateBlog.mutateAsync({ ...formData, id: blogId });
      toast.success("Blog updated successfully");

      reset(formData);
      refetchBlog();
    } catch (error) {
      console.error(error);
      alert("Error updating blog, please try again");
    }
  });

  const hostedBlogUrl = getHostedBlogUrl(blog?.slug || "");

  const queryClient = useQueryClient();
  const { mutateAsync: deleteBlogMutation } = useDeleteBlogMutation();

  async function deleteBlog() {
    await deleteBlogMutation(blogId);
    await router.push("/blogs");
  }

  async function onDeleteBlogClick() {
    const confirm1 = prompt(
      `To confirm you want to delete this blog, type "Delete ${blog?.title}"`
    );
    if (confirm1 === `Delete ${blog?.title}`) {
      if (
        confirm(
          "This action is irreversible. Are you sure you want to delete this blog?"
        )
      ) {
        await deleteBlog();
      }
    }
  }

  const [newAPIKey, setNewAPIKey] = useState("");
  const [showNewAPIKeyDialog, setShowNewAPIKeyDialog] = useState(false);
  const generateAPIKey = async () => {
    const res = await API().v2.blogs[":blogId"]["api-keys"].rotate.$post({
      param: {
        blogId,
      },
    });

    if (!res.ok) {
      toast.error("Error generating api key");
      return;
    }

    const data = (await res.json()) as { message: string; apiKey: string };
    setNewAPIKey(data.apiKey);
    setShowNewAPIKeyDialog(true);

    refetchBlog();
    toast.success("API key created");
  };

  if (blogLoading) {
    return <AppLayout loading={true}></AppLayout>;
  }

  if (blogError) {
    return <div>Error loading blog</div>;
  }

  if (!blog) {
    return <div>Blog not found</div>;
  }

  return (
    <AppLayout>
      <div className="mx-auto mt-8 flex max-w-2xl flex-col gap-10 p-4 px-3">
        <section className="section">
          <div className="p-3">
            <h1 className="text-xl font-medium">
              {blog.emoji} {blog.title}
            </h1>
            <p className="text-sm text-slate-600">{blog.description}</p>
            <Link
              target="_blank"
              className="mt-4 flex items-center gap-1 font-mono text-sm tracking-tighter text-slate-500"
              href={hostedBlogUrl.toString()}
            >
              <ExternalLink size={16} />
              {hostedBlogUrl.hostname}
            </Link>
          </div>
          <hr className="mt-3" />
          <div className="p-3">
            <form onSubmit={onSubmit} className="flex flex-col gap-2">
              <div className="flex items-end gap-4">
                <label htmlFor="emoji" title="Emoji">
                  <Controller
                    control={control}
                    name="emoji"
                    defaultValue={blog.emoji}
                    render={({ field: { onChange, value } }) => (
                      <EmojiPicker onEmojiChange={onChange} emoji={value} />
                    )}
                  ></Controller>
                </label>
                <div className="flex-grow">
                  <Label className="flex-grow" htmlFor="title">
                    Title
                  </Label>
                  <Input
                    type="text"
                    id="title"
                    className="flex w-full flex-grow"
                    required
                    {...register("title", {
                      value: blog.title,
                    })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  className="resize-none"
                  id="description"
                  {...register("description", {
                    value: blog.description || "",
                  })}
                />
              </div>

              <div className="actions mt-1">
                <Button type="submit">Save</Button>
              </div>
            </form>
          </div>
        </section>

        <section className="section p-3">
          <h2 className="text-lg font-medium">Blog API key</h2>
          <p className="text-zinc-500">
            Use this key to fetch your blogs content through the API.
          </p>
          <div className="mt-4 flex items-center gap-2">
            {blog.access_token ? (
              <div className="flex w-full items-center justify-end gap-3">
                <Button
                  onClick={() => {
                    if (
                      confirm(
                        "Are you sure you want to rotate the API key?\n The current one will stop working."
                      )
                    ) {
                      generateAPIKey();
                    }
                  }}
                  variant={"destructive"}
                >
                  Rotate API key
                </Button>
              </div>
            ) : (
              <>
                <Button
                  onClick={() => {
                    generateAPIKey();
                  }}
                  variant={"outline"}
                >
                  Generate API key
                </Button>
              </>
            )}
          </div>
          <Dialog open={showNewAPIKeyDialog}>
            <DialogContent className="flex max-w-sm flex-col gap-4">
              <DialogHeader>
                <DialogTitle>New API key</DialogTitle>
                <DialogDescription>
                  Make sure to save this key in a secure location. <br /> It
                  will not be shown again.{" "}
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center gap-2">
                <Input
                  value={newAPIKey}
                  readOnly
                  className="flex-grow font-mono"
                />
                <Button
                  variant={"outline"}
                  onClick={() => {
                    navigator.clipboard.writeText(newAPIKey || "");
                    toast.success("API key copied to clipboard");
                  }}
                >
                  Copy
                </Button>
              </div>

              <DialogFooter>
                <Button onClick={() => setShowNewAPIKeyDialog(false)}>
                  I have saved the key securely
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </section>

        <section className="section border bg-white p-3">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-medium text-red-600">
            Danger zone
          </h2>
          <p className="text-zinc-500">
            This action cannot be undone. This will delete all posts in the
            blog.
          </p>
          <div className="actions">
            <Button
              onClick={onDeleteBlogClick}
              variant={"destructive"}
              className="mt-4"
            >
              Delete blog
            </Button>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
