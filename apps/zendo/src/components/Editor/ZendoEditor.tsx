/* eslint-disable @next/next/no-img-element */
import { EditorContent, JSONContent, useEditor } from "@tiptap/react";
import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { SaveIcon, Trash2Icon, Settings2, ChevronRight } from "lucide-react";
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
import { useBlogQuery, useBlogsQuery } from "@/queries/blogs";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { usePostsQuery } from "@/queries/posts";

const formSchema = z.object({
  title: z.string(),
  published: z.boolean(),
  slug: z.string(),
  cover_image: z.string().optional(),
  content: z.any(),
});

type FormData = z.infer<typeof formSchema>;

type EditorContent = {
  content: JSONContent;
  title: string;
  slug: string;
  cover_image?: string;
  published: boolean;
};

type Props = {
  onSave: (content: EditorContent) => void;
  onDelete: () => void;
  readOnly?: boolean;
  post?: {
    id: string;
    title: string;
    slug: string;
    published: boolean;
    cover_image?: string;
    content: JSONContent;
  };
};

export const ZendoEditor = (props: Props) => {
  const { register, handleSubmit, setValue, watch, getValues } =
    useForm<FormData>({
      defaultValues: {
        title: props.post?.title || "",
        slug: props.post?.slug || "",
        published: props.post?.published || false,
        cover_image: props.post?.cover_image || "",
      },
    });
  const router = useRouter();
  const blogId = (router.query.blogId as string) || "demo";
  const [coverImgUrl, setCoverImgUrl] = React.useState<string | null>(null);
  const [showImagePicker, setShowImagePicker] = React.useState(false);

  const blogsQuery = useBlogsQuery();
  const postsQuery = usePostsQuery();

  const blogQuery = useBlogQuery(blogId);

  const title = watch("title");

  useEffect(() => {
    setValue("slug", generateSlug(title || ""));
  }, [title, setValue]);

  const editor = useEditor({
    content: props.post?.content || "",
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
    const content = editor?.getJSON() || {};
    const published = data.published ? true : false;

    props.onSave({
      content,
      title: data.title,
      slug: data.slug,
      cover_image: data.cover_image,
      published,
    });
  });

  function onCoverImageSelect(image: string) {
    setCoverImgUrl(image);
    setValue("cover_image", image);
  }

  return (
    <>
      <form
        onSubmit={formSubmit}
        className="flex w-full items-center justify-between border-b px-3 py-1.5"
      >
        <div className="flex items-center gap-1 rounded-xl text-sm font-medium tracking-tight text-slate-800">
          {blogsQuery.isLoading ? null : (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div
                  // href={`/blogs/${blogQuery.data?.id}/posts`}
                  className="flex items-center gap-1.5 rounded-md px-2 py-1 hover:bg-slate-100"
                >
                  <span className="flex h-6 w-6 items-center justify-center text-lg">
                    {blogQuery.data?.emoji}
                  </span>
                  <span>{blogQuery.data?.title}</span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="-mt-1 max-w-[240px]">
                {blogsQuery.data?.map((blog) => (
                  <DropdownMenuItem key={blog.id} asChild>
                    <Link
                      href={`/blogs/${blog.id}/posts`}
                      className="flex gap-2 px-2 py-1 hover:bg-slate-100"
                    >
                      <span>{blog.emoji}</span>
                      <span>{blog.title}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <div className="text-slate-300">
            <ChevronRight size="16" />
          </div>
          {postsQuery.isLoading ? null : (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div
                  // href={`/blogs/${blogQuery.data?.id}/posts`}
                  className="flex items-center gap-1.5 rounded-md px-2 py-1 hover:bg-slate-100"
                >
                  <span>{props.post?.title || "Untitled"}</span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="-mt-1 max-w-[240px]">
                {postsQuery.data?.posts?.map((post) => (
                  <DropdownMenuItem key={post.id} asChild>
                    <Link
                      href={`/blogs/${blogId}/post/${post.slug}`}
                      className="flex gap-2 px-2 py-1 hover:bg-slate-100"
                    >
                      <span className="text-xs">
                        {post.published ? "🟢" : "🟠"}
                      </span>
                      <span>{post.title}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <div className="actions">
          <Label
            className="mr-2 flex items-center gap-2 text-sm font-semibold"
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
          <img className="max-h-96" src={coverImgUrl || ""} alt="" />
        </div>
        <div className="group mt-4 pb-2">
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
            <ImagePicker
              open={showImagePicker}
              onOpenChange={setShowImagePicker}
              onSelect={(img) => {
                onCoverImageSelect(img.url);
                setShowImagePicker(false);
              }}
              onCancel={() => {}}
            >
              <Button asChild variant={"secondary"} className="h-8">
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
        <div className="prose prose-h2:font-medium group">
          {!props.readOnly && <EditorMenu editor={editor} />}
          <div
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className="prose -mt-2 min-h-[700px] cursor-text rounded-lg transition-all focus-within:bg-slate-50 hover:bg-slate-50"
          >
            <EditorContent className="" editor={editor} />
          </div>
        </div>
      </div>
    </>
  );
};
