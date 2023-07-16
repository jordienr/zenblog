import AppLayout from "@/layouts/AppLayout";
import { createAPIClient } from "@/lib/app/api";
import { PatchBlog } from "@/lib/models/blogs/Blogs";
import { useRouter } from "next/router";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";
import { EmojiPicker } from "@/components/EmojiPicker";
import { Invitations } from "@/components/Blogs/Invitations";
import { Members } from "@/components/Blogs/Members";

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
      <div className="mx-auto mt-8 flex max-w-2xl flex-col gap-10 p-4 px-3">
        <section className="section p-3">
          <h1 className="text-xl font-medium">
            {blog.emoji} {blog.title}
          </h1>
          <p className="text-sm text-slate-600">{blog.description}</p>
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
          <h2 className="text-lg font-medium">Invitations</h2>
          <p className="text-sm text-slate-500">
            Invite others to this blog so they can write and manage content.
          </p>
          <Invitations blog={blog} />
        </section>

        <section className="section p-3">
          <h2 className="text-lg font-medium">Members</h2>
          <Members blog={blog} />
        </section>

        <section className="section p-3">
          <h2 className="text-lg font-medium">API Guide</h2>
          <h3 className="mb-4 mt-8">1. Install the zendo API client</h3>
          <pre className="rounded-lg bg-slate-800 p-4 text-slate-200">
            <code>{`npm install @zendo/cms`}</code>
          </pre>

          <h3 className="mb-4 mt-8">2. Create a client</h3>

          <pre className="rounded-lg bg-slate-800 p-4 text-slate-200">
            <code>
              {`import createClient from "@zendo/cms";`}
              <br />
              {`
const cms = createClient({
  blogId: "${blog.id}",
})
              `}
            </code>
          </pre>
        </section>

        <section className="section border border-red-100 bg-gradient-to-b from-white to-red-100 p-3 text-red-600">
          <h2 className="mb-4 text-lg font-medium">🚨 Danger zone</h2>
          <p className="text-sm">
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
