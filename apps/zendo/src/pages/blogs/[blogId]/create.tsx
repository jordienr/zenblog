import type { GetServerSideProps } from "next";
import AppLayout from "@/layouts/AppLayout";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useState } from "react";
import { generateSlug } from "@/lib/utils/slugs";
import { z } from "zod";
import { EditorContent, JSONContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import { useAppStore } from "@/store/app";
import { Blog } from "@/lib/models/blogs/Blogs";
import ImageExt from "@tiptap/extension-image";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const formSchema = z.object({
  title: z.string(),
  slug: z.string(),
  published: z.boolean(),
});
type FormData = z.infer<typeof formSchema>;

export default function BlogDashboard() {
  const { handleSubmit, register, setValue } = useForm<FormData>();

  async function uploadImage(file: File) {
    // wait 2s
    // return the image url
    // const { data, error } = await db.storage
    //   .from("images")
    //   .upload("image.png", file);
    // return data;
  }

  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExt,
      Heading.configure({
        levels: [2, 3, 4, 5, 6],
      }),
    ],
    content: "",
  });

  // const auth = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const blogId = router.query.blogId as string;
  const store = useAppStore();
  const supa = useSupabaseClient();

  const onSubmit = handleSubmit(async (data) => {
    store.startLoading();
    // const token = await auth.getToken({ template: "supabase" });

    try {
      const formData = formSchema.parse(data);
      const user = await supa.auth.getUser();

      if (!user.data.user) {
        throw new Error("No user");
      }

      const payload = {
        title: formData.title,
        slug: formData.slug,
        content: editor?.getJSON(),
        blog_id: blogId,
        user_id: user.data.user.id,
        published: formData.published,
      };

      const res = await supa.from("posts").insert(payload);

      const jsonContent = editor?.getJSON();
      if (!jsonContent) {
        throw new Error("No content");
      }

      if (res.error) {
        console.error(res.error);
        if (res.error.code === "23505") {
          alert("A post with that slug already exists");
          return;
        } else {
          alert("Error creating post, please try again");
        }
      } else {
        await router.push(`/blogs/${blogId}/posts`);
      }
    } catch (error) {
      console.error(error);
      alert("Error creating blog, please try again");
    } finally {
      store.stopLoading();
    }
  });

  // useEffect(() => {
  //   window.addEventListener("keydown", async (e) => {
  //     if (e.key === "s" && e.metaKey) {
  //       // e.preventDefault();
  //       console.log("saving");
  //     }
  //     if (e.key === "v" && e.metaKey) {
  //       // e.preventDefault();
  //       console.log("pasting");
  //       const clipboard = await navigator.clipboard.readText();
  //       console.log(clipboard);
  //       // if its an image, grab the image and upload it to supabase
  //       const files = await navigator.clipboard.read();
  //       console.log(files);

  //     }
  //   });
  // }, []);

  return (
    <AppLayout>
      <div className="relative mx-auto flex max-w-5xl flex-col">
        <form onSubmit={onSubmit} className="flex-grow pb-24 pt-3">
          <div className="sticky left-0 right-0 top-0 z-40 mx-auto flex max-w-5xl justify-end gap-4 p-4">
            <div className="flex items-center">
              <label
                className="flex items-center gap-2 font-semibold"
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
            </div>
            <button type="submit" className="btn btn-primary max-w-[120px]">
              Save
              {/* <Shortcut shortcut="cmd S" /> */}
            </button>
          </div>
          <div className="mx-auto flex flex-col gap-3 bg-white">
            <label
              htmlFor="slug"
              className="flex items-center gap-1 px-2 py-1.5 transition-all hover:bg-white"
            >
              <input
                {...register("slug")}
                required
                title="Slug"
                placeholder="a-really-good-slug"
                className="focus:ring-none w-full rounded-lg bg-transparent p-2 font-mono"
              />
            </label>
            <label htmlFor="title" className="px-2">
              <input
                type="test"
                placeholder={"A really good title"}
                {...register("title", {
                  required: true,
                  onChange: (e) => {
                    setTitle(e.target.value);
                    setValue("slug", generateSlug(e.target.value));
                  },
                })}
                required
                className="h-14 w-full rounded-lg border-none bg-transparent px-2 font-serif text-2xl font-medium text-slate-800 hover:bg-white md:text-3xl"
              />
            </label>

            <EditorContent
              editor={editor}
              className="prose:min-w-none h2:font-serif prose flex min-h-[600px] w-full max-w-none rounded-md px-2 text-lg text-slate-600"
            />
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
