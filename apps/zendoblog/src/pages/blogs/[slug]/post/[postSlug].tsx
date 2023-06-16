import AppLayout from "@/layouts/AppLayout";
import { getClient } from "@/lib/supabase";
import { getAuth } from "@clerk/nextjs/server";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";
import { PencilIcon, SaveIcon, Trash2Icon } from "lucide-react";
import Heading from "@tiptap/extension-heading";
import { useAuth } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAppStore } from "@/store/app";
import { Post } from "@/lib/models/posts/Posts";

export default function Post({ post }: { post: Post }) {
  const [editable, setEditable] = useState(false);

  const router = useRouter();
  const auth = useAuth();
  const store = useAppStore();

  const formSchema = z.object({
    title: z.string(),
    published: z.boolean(),
    slug: z.string(),
  });

  type FormData = z.infer<typeof formSchema>;
  const { register, handleSubmit, setValue } = useForm<FormData>();

  function toggleEditable() {
    const newEditable = !editable;
    setEditable(newEditable);
    editor?.setOptions({ editable: newEditable });
    setValue("title", post.title);
    setValue("published", post.published);
    setValue("slug", post.slug);
  }

  const editor = useEditor({
    extensions: [StarterKit, Heading.configure({ levels: [2, 3, 4, 5, 6] })],
    content: JSON.parse(post.content),
    editable,
  });

  async function handleDeleteClick() {
    if (confirm("Are you sure you want to delete this post?")) {
      const token = await auth.getToken({ template: "supabase" });
      if (!token) {
        alert("Error deleting post, please try again");
        return;
      }
      const sb = getClient(token);
      const { data, error } = await sb
        .from("posts")
        .delete()
        .eq("post_id", post.id);

      if (error) {
        console.error(error);
        alert("Error deleting post, please try again");
      } else {
        await router.push(`/blogs/${post.blog_slug}/posts`);
      }
    }
  }

  const onSubmit = handleSubmit(async (data) => {
    store.startLoading();
    const newPost = {
      ...data,
      content: JSON.stringify(editor?.getJSON()),
    };
    const token = await auth.getToken({ template: "supabase" });
    if (!token) {
      alert("Error updating post, please try again");
      return;
    }
    const sb = getClient(token);
    const res = await sb.from("posts").update(newPost).eq("post_id", post.id);

    if (res.error) {
      console.error(res.error);
      if (res.error.code === "23505") {
        alert("A post with that slug already exists");
        return;
      } else {
        alert("Error updating post, please try again");
      }
    }
    router.reload();
  });

  return (
    <AppLayout>
      {/* {router.query.postSlug} - {router.query.slug} */}
      <form onSubmit={onSubmit} className="mx-auto max-w-5xl p-3">
        <div className="flex items-center justify-between gap-4">
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
            </div>
          ) : (
            <h1 className="text-3xl font-semibold">{post.title}</h1>
          )}

          {!editable && (
            <button onClick={toggleEditable} className="btn btn-primary">
              <PencilIcon color="white" className="h-6 w-6" />
              Edit
            </button>
          )}
        </div>
        <div
          className={`prose mt-4 min-w-full rounded-lg ${
            editable ? "border bg-white shadow-sm" : "bg-transparent"
          }`}
        >
          <EditorContent className="min-h-[440px] bg-white" editor={editor} />
        </div>
        <div className="mt-4">
          {editable && (
            <div className="flex items-center justify-between">
              <button onClick={handleDeleteClick} className="btn">
                <Trash2Icon color="gray" className="h-6 w-6" /> Delete
              </button>
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
        </div>
      </form>
    </AppLayout>
  );
}
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { getToken, userId } = getAuth(ctx.req);
  const token = await getToken({ template: "supabase" });

  if (!token) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }

  const sb = getClient(token);

  const { data, error } = await sb
    .from("posts")
    .select("*")
    .eq("user_id", userId)
    .eq("slug", ctx.query.postSlug)
    .eq("blog_slug", ctx.query.slug)
    .single();

  if (error) {
    console.error(error);
  }

  return {
    props: {
      foo: "bar",
      post: data,
    },
  };
};
