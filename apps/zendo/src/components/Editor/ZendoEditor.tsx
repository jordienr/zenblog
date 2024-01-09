/* eslint-disable @next/next/no-img-element */
import { EditorContent, JSONContent, useEditor } from "@tiptap/react";
import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { SaveIcon, Trash2Icon, Settings2 } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { ImagePicker } from "../Images/ImagePicker";
import { BsFillImageFill } from "react-icons/bs";
import { EditorMenu } from "./EditorMenu";
import TiptapImage from "@tiptap/extension-image";
import StarterKit from "@tiptap/starter-kit";
import UploadImagesPlugin, { startImageUpload } from "./upload-image";
import { generateSlug } from "@/lib/utils/slugs";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { useRouter } from "next/router";

const formSchema = z.object({
  title: z.string(),
  published: z.boolean(),
  slug: z.string(),
  id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  blog_id: z.string(),
  user_id: z.string(),
  cover_image: z.string().optional(),
  content: z.any(),
});
type FormData = z.infer<typeof formSchema>;

type EditorContent = {
  content: JSONContent;
  title: string;
  slug: string;
  published: boolean;
};

type Props = {
  onSave: (content: EditorContent) => void;
  onDelete: () => void;
  readOnly?: boolean;
  post?: any;
};

export const ZendoEditor = (props: Props) => {
  const { register, handleSubmit, setValue, watch } = useForm<FormData>();
  const router = useRouter();
  const blogId = (router.query.id as string) || "demo";

  const title = watch("title");

  useEffect(() => {
    setValue("slug", generateSlug(title || ""));
  }, [title, setValue]);

  const editor = useEditor({
    editorProps: {
      editable: () => !props.readOnly || false,
      handlePaste: (view, event) => {
        console.log("handlePaste", view, event);
        if (
          event.clipboardData &&
          event.clipboardData.files &&
          event.clipboardData.files[0]
        ) {
          event.preventDefault();
          const file = event.clipboardData.files[0];
          const pos = view.state.selection.from;

          startImageUpload(file, view, pos, blogId);
          return true;
        }
        return false;
      },
    },
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3, 4, 5, 6],
        },
      }),
      TiptapImage.extend({
        addProseMirrorPlugins() {
          return [UploadImagesPlugin()];
        },
      }),
    ],
  });

  const formSubmit = handleSubmit(async (data) => {
    console.log(data);
  });

  function handleDeleteClick() {
    console.log("delete");
  }

  function onCoverImageSelect() {
    console.log("cover image select");
  }

  return (
    <>
      <form
        onSubmit={formSubmit}
        className="flex w-full items-center justify-between border-b px-3 py-1.5"
      >
        <div className="flex gap-2 rounded-xl">
          <Button
            size="icon"
            variant="ghost"
            type="button"
            onClick={handleDeleteClick}
          >
            <Trash2Icon color="red" className="h-6 w-6" />
          </Button>
        </div>
        <div className="actions">
          <Label
            className="mr-2 flex items-center gap-2 font-semibold"
            htmlFor="published"
          >
            <Checkbox id="published" {...register("published")} />
            Publish
          </Label>

          <Button type="button" variant="secondary">
            <Settings2 />
            SEO
          </Button>
          <Button type="submit">
            <SaveIcon />
            Save
          </Button>
        </div>
      </form>
      <div className="mx-auto mt-2 flex w-full max-w-2xl flex-col px-2">
        <div className="flex items-center justify-center bg-slate-100">
          <img className="max-h-96" src={""} alt="" />
        </div>
        <div className="group mt-4 border-b border-slate-100 pb-2">
          <div className="flex w-full justify-between gap-2 transition-all">
            <label className="flex w-full items-center gap-2" htmlFor="slug">
              <input
                placeholder="a-great-title"
                type="text"
                {...register("slug")}
                className="w-full rounded-lg p-2 font-mono text-xs outline-none hover:bg-slate-50 focus-visible:bg-slate-100"
                autoComplete="off"
              />
            </label>
            <ImagePicker onSelect={onCoverImageSelect}>
              <Button asChild variant={"secondary"}>
                <span className="btn btn-text whitespace-nowrap !text-xs">
                  <BsFillImageFill className="h-4 w-4" />
                  Cover image
                </span>
              </Button>
            </ImagePicker>
          </div>

          <input
            placeholder="A great title"
            type="text"
            {...register("title")}
            className="mt-1 w-full max-w-2xl whitespace-break-spaces rounded-xl border-none bg-transparent p-2
            text-4xl
             font-medium outline-none transition-all hover:bg-slate-50 focus-visible:bg-slate-100"
          />
        </div>
        <div className="prose prose-headings:font-serif prose-h2:font-normal group">
          {!props.readOnly && (
            <div className="border-b border-slate-100 transition-all">
              <EditorMenu editor={editor} />
            </div>
          )}
          <div
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className="prose -mt-2 min-h-[700px] cursor-text rounded-lg transition-all focus-within:bg-slate-50 hover:bg-slate-50"
          >
            <EditorContent className="" editor={editor} />
            <button
              className="border"
              onClick={() => {
                const html = editor?.getHTML();
                const json = editor?.getJSON();
                console.log(html, json);
              }}
            >
              value
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
