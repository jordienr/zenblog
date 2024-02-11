import AppLayout from "@/layouts/AppLayout";
import { createAPIClient } from "@/lib/app/api";
import { PatchBlog } from "@/lib/models/blogs/Blogs";
import { useRouter } from "next/router";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { EmojiPicker } from "@/components/EmojiPicker";
import { Invitations } from "@/components/Blogs/Invitations";
import { Members } from "@/components/Blogs/Members";
import { CodeBlock } from "@/components/CodeBlock";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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
                required
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

        {/* <section className="section p-3">
          <h2 className="text-lg font-medium">Invitations</h2>
          <p className="text-sm text-slate-500">
            Invite others to this blog so they can write and manage content.
          </p>
          <Invitations blog={blog} />
        </section> */}

        {/* <section className="section p-3">
          <h2 className="text-lg font-medium">Members</h2>
          <Members blog={blog} />
        </section> */}

        <section className="section p-3">
          <h2 className="text-lg font-medium">Integration guide</h2>
          <h3 className="mb-4 mt-8">1. Install the zendo API client</h3>
          <CodeBlock language="bash">{`npm install zenblog`}</CodeBlock>

          <h3 className="mb-4 mt-8">2. Create a client</h3>

          <CodeBlock title="/pages/blog.tsx">
            {`
import { createClient } from "zenblog";

const cms = createClient({
  blogId: "${blog.id}",
});
            `}
          </CodeBlock>

          <h3>
            3. Use the client to fetch posts and render them on your website
          </h3>
        </section>

        <section className="section border border-red-300 bg-gradient-to-b from-white to-red-50 p-3 text-red-600">
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
