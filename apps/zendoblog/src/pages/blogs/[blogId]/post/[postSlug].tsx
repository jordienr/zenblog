import AppLayout from "@/layouts/AppLayout";
import { useRouter } from "next/router";
import { EditorContent, JSONContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";
import { PencilIcon, SaveIcon, Trash2Icon } from "lucide-react";
import Heading from "@tiptap/extension-heading";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQuery } from "react-query";
import { createAPIClient } from "@/lib/app/api";
import { ContentRenderer } from "@/components/ContentRenderer";
import Spinner from "@/components/Spinner";

export default function Post() {
  const [editable, setEditable] = useState(false);

  const api = createAPIClient();
  const router = useRouter();

  const blogId = router.query.blogId as string;
  const postSlug = router.query.postSlug as string;

  const formSchema = z.object({
    title: z.string(),
    published: z.boolean(),
    slug: z.string(),
  });

  type FormData = z.infer<typeof formSchema>;
  const { register, handleSubmit, setValue } = useForm<FormData>();

  const {
    data: post,
    isLoading,
    error: postError,
  } = useQuery(["posts", router.query.blogId, router.query.postSlug], () =>
    api.posts.get(blogId, postSlug)
  );

  const editor = useEditor({
    extensions: [StarterKit, Heading.configure({ levels: [2, 3, 4, 5, 6] })],
    content: post?.content,
  });

  function toggleEditable() {
    if (!post) return;
    const newEditable = !editable;
    setEditable(newEditable);
    setValue("title", post.title);
    setValue("published", post.published);
    setValue("slug", post.slug);
    editor?.commands.setContent(post.content);
  }

  const deletePost = useMutation({
    mutationFn: () => api.posts.delete(blogId, postSlug),
  });

  async function handleDeleteClick() {
    if (!confirm("Are you sure you want to delete this post?")) return;
    await deletePost.mutateAsync();
    router.push(`/blogs/${blogId}/posts`);
  }

  const updatePost = useMutation({
    mutationFn: (
      data: {
        content: JSONContent;
      } & FormData
    ) => api.posts.update(blogId, postSlug, data),
  });

  const onSubmit = handleSubmit(async (data) => {
    const slugHasChanged = data.slug !== postSlug;

    const newPost = {
      ...data,
      content: editor?.getJSON() || {},
    };
    await updatePost.mutateAsync(newPost);
    if (slugHasChanged) {
      await router.push(`/blogs/${blogId}/post/${data.slug}`);
    } else {
      router.reload();
    }
    setEditable(false);
  });

  return (
    <AppLayout>
      {/* {router.query.postSlug} - {router.query.slug} */}
      {isLoading && (
        <div className="flex-center p-12">
          <Spinner />
        </div>
      )}
      {post && (
        <form onSubmit={onSubmit} className="mx-auto max-w-5xl p-3">
          {editable && (
            <div className="flex items-center justify-between py-2">
              <div>
                <button
                  type="button"
                  onClick={handleDeleteClick}
                  className="btn"
                >
                  <Trash2Icon color="gray" className="h-6 w-6" /> Delete
                </button>
              </div>
              <div className="actions">
                <label
                  className="mr-2 flex items-center gap-2 font-semibold"
                  htmlFor="published"
                >
                  <input
                    id="published"
                    type="checkbox"
                    {...register("published")}
                    className="h-6 w-6 rounded-md shadow-sm"
                  />
                  Publish
                </label>

                <button type="submit" className="btn btn-primary">
                  <SaveIcon color="white" className="h-6 w-6" />
                  Save
                </button>
              </div>
            </div>
          )}
          <div className="">
            {editable ? (
              <div className="w-full">
                <input
                  type="text"
                  {...register("slug")}
                  className="w-full border-none bg-transparent font-mono text-sm outline-none hover:bg-white focus:bg-white"
                />
                <input
                  type="text"
                  {...register("title")}
                  className="mt-1 w-full border-none bg-transparent text-3xl font-semibold outline-none hover:bg-white focus:bg-white"
                />
                <div className="prose mt-4">
                  <EditorContent editor={editor} />
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex justify-end">
                  <button onClick={toggleEditable} className="btn btn-primary">
                    <PencilIcon color="white" className="h-6 w-6" />
                    Edit
                  </button>
                </div>
                <span className="font-mono text-sm text-slate-500">
                  {post?.slug}
                </span>
                <h1 className="text-3xl font-semibold">{post?.title}</h1>
                <ContentRenderer content={post.content} />
              </div>
            )}
          </div>
        </form>
      )}
    </AppLayout>
  );
}
// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   const { getToken, userId } = getAuth(ctx.req);
//   const token = await getToken({ template: "supabase" });

//   if (!token) {
//     return {
//       redirect: {
//         destination: "/sign-in",
//         permanent: false,
//       },
//     };
//   }

//   const sb = getClient(token);

//   const { data, error } = await sb
//     .from("posts")
//     .select("*")
//     .eq("user_id", userId)
//     .eq("slug", ctx.query.postSlug)
//     .eq("blog_id", ctx.query.blogId)
//     .single();

//   if (error) {
//     console.error(error);
//   }

//   return {
//     props: {
//       foo: "bar",
//       post: data,
//     },
//   };
// };
