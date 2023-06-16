import { HiddenField } from "@/components/HiddenField";
import Spinner from "@/components/Spinner";
import { useSupabase } from "@/hooks/useSupabase";
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
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { EmojiPicker } from "@/components/EmojiPicker";
import { UnknownKeysParam } from "zod";

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
  const slug = router.query.slug as string;
  const api = createAPIClient();

  const {
    isLoading: blogLoading,
    data: blog,
    error: blogError,
    refetch: refetchBlog,
  } = useQuery(["blog", slug], () => api.blogs.get(slug));

  const {
    isLoading: apiKeysLoading,
    data: apiKeys,
    refetch: refetchApiKeys,
  } = useQuery(["apiKeys", slug], () => api.apiKeys.getAll(slug));

  const updateBlog = useMutation({
    mutationFn: (blogData: PatchBlog) => api.blogs.update(slug, blogData),
  });

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const res = await updateBlog.mutateAsync(formData);
      toast.success("Blog updated successfully");
      const slugHasChanged = slug !== res.slug;

      if (slugHasChanged) {
        await router.push(`/blogs/${res.slug}/settings`);
      } else {
        reset(formData);
        refetchBlog();
      }
    } catch (error) {
      console.error(error);
      alert("Error updating blog, please try again");
    }
  });

  const { mutateAsync: deleteBlogMutation } = useMutation({
    mutationFn: () => api.blogs.delete(slug),
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

  const [showApiKeyDialog, setShowApiKeyDialog] = useState<boolean>(false);
  const [newApiKeyName, setNewApiKeyName] = useState<string>("");
  const { mutateAsync: createApiKey, isLoading: createApiKeyLoading } =
    useMutation({
      mutationFn: () => api.apiKeys.create(slug, newApiKeyName),
    });

  async function onCreateKeyClick(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await createApiKey();
    await refetchApiKeys();
    setShowApiKeyDialog(false);
  }

  const { mutateAsync: deleteApiKey, isLoading: deleteApiKeyLoading } =
    useMutation({
      mutationFn: (key: string) => api.apiKeys.delete(key),
    });
  async function handleDeleteApiKey(key: APIKey) {
    if (confirm("Are you sure you want to delete this API key?")) {
      await deleteApiKey(key.key);
      await refetchApiKeys();
    }
  }

  if (blogLoading || apiKeysLoading) {
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
      <div className="mx-auto mt-8 max-w-2xl p-4">
        <section className="section mx-auto mt-4 p-3">
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

            <label htmlFor="slug">
              <span className="block">Slug</span>
              <input
                type="text"
                id="slug"
                required
                {...register("slug", {
                  value: blog.slug,
                })}
              />
            </label>
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

        <section className="section relative mt-12 overflow-hidden p-3 transition-all">
          <h2 className="text-xl font-semibold">API Client Keys</h2>
          <p className="mt-2 text-slate-700">
            This is the API key you can use to access the blog via the API.{" "}
            <br />
            <b className="text-red-500">
              This is a secret key, do not share it with anyone.
            </b>
          </p>

          {apiKeysLoading ||
            (createApiKeyLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white p-12">
                <Spinner />
              </div>
            ))}

          {showApiKeyDialog && (
            <div className="absolute inset-0 flex items-center justify-center bg-white p-12">
              <form onSubmit={onCreateKeyClick} className="flex flex-col gap-4">
                <label htmlFor="newApiKeyName">
                  API key name
                  <input
                    onChange={(e) => setNewApiKeyName(e.target.value)}
                    type="text"
                    id="newApiKeyName"
                    required
                  />
                </label>

                <div className="actions">
                  <button
                    className="btn btn-secondary"
                    type="reset"
                    onClick={() => setShowApiKeyDialog(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary"
                    type="submit"
                    disabled={createApiKeyLoading}
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          )}

          {apiKeys?.length === 0 && (
            <div className="mt-4 font-mono">
              You don`t have any API keys yet.{" "}
            </div>
          )}

          {!apiKeysLoading && apiKeys && apiKeys.length > 0 && (
            <div className="mt-6">
              <ul className="mt-2 space-y-2">
                {apiKeys?.map((key) => (
                  <li key={key.key} className="mt-1">
                    <div className="flex items-center justify-between gap-2 font-mono">
                      <span
                        title={key.name}
                        className="w-32 overflow-hidden text-ellipsis whitespace-nowrap text-sm"
                      >
                        {key.name}
                      </span>
                      <HiddenField value={key.key} />
                      <button
                        onClick={() => handleDeleteApiKey(key)}
                        className="btn btn-icon"
                      >
                        <CgTrash />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="actions mt-4">
            <button
              onClick={() => setShowApiKeyDialog(true)}
              className="btn btn-primary"
            >
              Create API Key
            </button>
          </div>
        </section>

        <section className="mt-12 rounded-md border border-red-100 bg-gradient-to-b from-white to-red-100 p-3 text-red-600">
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
