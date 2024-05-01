import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import { useForm } from "react-hook-form";
import { generateSlug } from "@/lib/utils/slugs";

const Tiptap = () => {
  type FormData = {
    title: string;
    slug: string;
    content: string;
  };
  const { handleSubmit, register, setValue } = useForm<FormData>();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Heading.configure({
        levels: [2, 3, 4, 5, 6],
      }),
    ],
    content: "",
    onUpdate(d) {},
  });

  return (
    <div className="prose-sm font-mono">
      <form className="mx-auto flex max-w-5xl flex-col gap-4 rounded-md bg-white p-3 shadow-sm">
        <div>
          <label htmlFor="title">
            Title
            <input
              {...register("title", {
                onChange: (e) => {
                  const val = e.target.value;
                  const slug = generateSlug(val);

                  setValue("slug", slug);
                },
              })}
              type="text"
              id="title"
              className="border-none bg-slate-100 text-3xl font-semibold"
            />
          </label>
          <label className="mt-1 flex items-center gap-2" htmlFor="slug">
            Slug
            <input
              {...register("slug")}
              type="text"
              id="slug"
              className="border-none text-xs font-semibold"
            />
          </label>
        </div>
        <label className="" htmlFor="content">
          Content
          <EditorContent className="rounded-md bg-slate-100" editor={editor} />
        </label>
      </form>
    </div>
  );
};
