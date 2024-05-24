import AppLayout from "@/layouts/AppLayout";
import { createAPIClient } from "@/lib/http/api";
import { PatchBlog } from "@/lib/models/blogs/Blogs";
import { useRouter } from "next/router";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { EmojiPicker } from "@/components/EmojiPicker";
import { Members } from "@/components/Blogs/Members";
import { CodeBlock } from "@/components/CodeBlock";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useBlogQuery, useUpdateBlogMutation } from "@/queries/blogs";
import { CopyCell } from "@/components/copy-cell";
import { AlertCircle, ExternalLink, Info } from "lucide-react";
import Link from "next/link";
import { CgArrowTopRight } from "react-icons/cg";
import { getHostedBlogUrl } from "@/utils/get-hosted-blog-url";

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
  const api = createAPIClient();

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
  const { mutateAsync: deleteBlogMutation } = useMutation({
    mutationFn: () => api.blogs.delete(blogId),
    onSuccess: () => {
      queryClient.invalidateQueries(["blogs"]);
    },
  });
  async function deleteBlog() {
    await deleteBlogMutation();
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
        alert("Deleting blog");
        await deleteBlog();
      } else {
        alert("Action cancelled. Nothing was deleted.");
      }
    } else {
      alert("Action cancelled. Nothing was deleted.");
    }
  }

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
        <section className="section p-3">
          <h1 className="text-xl font-medium">
            {blog.emoji} {blog.title}
          </h1>
          <p className="text-sm text-slate-600">{blog.description}</p>
          <hr className="my-4" />

          <Link
            target="_blank"
            className="flex items-center gap-1 font-mono text-sm tracking-tighter text-slate-500"
            href={hostedBlogUrl.toString()}
          >
            <ExternalLink size={16} />
            {hostedBlogUrl.hostname}
          </Link>

          <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-2">
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
              <Input
                type="text"
                id="description"
                {...register("description", {
                  value: blog.description || "",
                })}
              />
            </div>

            <div className="actions">
              {isDirty && <Button type="submit">Save</Button>}
            </div>
          </form>
        </section>

        <section className="section mt-24 border border-red-500 bg-white p-3">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-medium text-red-600">
            <AlertCircle size={24} className="text-red-600" />
            Danger zone
          </h2>
          <p className="font-mono text-red-600">
            This action cannot be undone.
            <br /> This will permanently delete the blog.
            <br />
            This will also delete all posts in the blog.
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
