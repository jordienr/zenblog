import { HiddenField } from "@/components/HiddenField";
import Spinner from "@/components/Spinner";
import AppLayout from "@/layouts/AppLayout";
import { createAPIClient } from "@/lib/app/api";
import { APIKey } from "@/lib/models/apiKeys/APIKeys";
import { PatchBlog } from "@/lib/models/blogs/Blogs";
import { useRouter } from "next/router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { CgTrash } from "react-icons/cg";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";
import { EmojiPicker } from "@/components/EmojiPicker";

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
  } = useQuery(["blog", blogId], () => api.blogs.get(blogId));

  const updateBlog = useMutation({
    mutationFn: (blogData: PatchBlog) => api.blogs.update(blogId, blogData),
  });

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const res = await updateBlog.mutateAsync(formData);
      toast.success("Blog updated successfully");

      reset(formData);
      refetchBlog();

    } catch (error) {
      console.error(error);
      alert("Error updating blog, please try again");
    }
  });

  const { mutateAsync: deleteBlogMutation } = useMutation({
    mutationFn: () => api.blogs.delete(blogId),
  });
  async function deleteBlog() {
    await deleteBlogMutation();
    await router.push("/blogs");
  }

  async function onDeleteBlogClick() {
    const confirm1 = prompt(
      `To confirm you want to delete this blog, type "I want to delete ${blog?.title}"`
    );
    if (confirm1 === `I want to delete ${blog?.title}`) {
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
      <div className="mx-auto mt-8 max-w-2xl p-4 flex flex-col gap-10 px-3">
        <section className="section p-3">
          <h1 className="text-xl font-medium">
            {blog.emoji} {blog.title}
          </h1>
          <p className="text-slate-600">{blog.description}</p>
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
              <label className="flex-grow" htmlFor="title">
                <span className="block">Title</span>
                <input
                  type="text"
                  id="title"
                  required
                  {...register("title", {
                    value: blog.title,
                  })}
                />
              </label>
            </div>
            <label htmlFor="description">
              <span className="block">Description</span>
              <input
                type="text"
                id="description"
                required
                {...register("description", {
                  value: blog.description || "",
                })}
              />
            </label>

            <div className="actions">
              {isDirty && (
                <button className="btn btn-primary" type="submit">
                  Save
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="section p-3">
        <h2 className="text-xl font-semibold">API Guide</h2>
                <h3 className="font-semibold mt-8 mb-4">Install the zendo API client</h3>
                <pre className="bg-slate-800 text-slate-200 p-4 rounded-lg">
                    <code>
                    npm install @znd/client
                    </code>
                </pre>

                <h3 className="font-semibold mt-8 mb-4">Create a client</h3>

                <pre className="bg-slate-800 text-slate-200 p-4 rounded-lg">

                    <code>
                    import &#123; createClient &#125; from "@znd/client";
                    <br />
                    <br />
                    const cms = createClient(&#123;
                    <br />
                    blogId: <span className="text-green-400 bg-green-500/20 p-1 rounded-lg">"{blog.id}"</span>,
                    <br />
                    &#125;);

                  </code>
                </pre>                    
        </section>

        <section className="section border border-red-100 bg-gradient-to-b from-white to-red-100 p-3 text-red-600">
          <h2 className="mb-4 text-xl font-bold">🚨 Danger zone</h2>
          <p className="text-lg">
            This action cannot be undone. This will permanently delete the blog.
            This will also delete all posts in the blog.
          </p>
          <div className="actions">
            <button onClick={onDeleteBlogClick} className="btn btn-red mt-4">
              Delete blog
            </button>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
