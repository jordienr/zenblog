/* eslint-disable @next/next/no-img-element */
import { EditorContent, useEditor } from "@tiptap/react";
import React, { useEffect } from "react";
import { Button } from "../ui/button";
import {
  SaveIcon,
  Settings2,
  ChevronRight,
  List,
  CornerUpLeft,
} from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { ImagePicker } from "../Images/ImagePicker";
import { BsFillImageFill } from "react-icons/bs";
import { EditorMenu } from "./EditorMenu";
import TiptapImage from "@tiptap/extension-image";
import StarterKit from "@tiptap/starter-kit";
import UploadImagesPlugin, { startImageUpload } from "./upload-image";
import { generateSlug } from "@/lib/utils/slugs";
import { Label } from "../ui/label";
import { useRouter } from "next/router";
import { useBlogQuery, useBlogsQuery } from "@/queries/blogs";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { usePostsQuery } from "@/queries/posts";
import { IoClose } from "react-icons/io5";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import EditorSettings from "./EditorSettings";
import TiptapLink from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";

const formSchema = z.object({
  title: z.string(),
  published: z.boolean(),
  slug: z.string(),
  cover_image: z.string().nullable(),
  content: z.any(),
});

type FormData = z.infer<typeof formSchema>;

type EditorContent = {
  content?: any;
  title: string;
  slug: string;
  cover_image?: string;
  published: boolean;
};

type Props = {
  onSave: (content: EditorContent) => void;
  readOnly?: boolean;
  post?: {
    id: string;
    title: string;
    slug: string;
    published: boolean;
    cover_image?: string;
    content?: any;
    metadata?: Record<string, any>;
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
  const [coverImgUrl, setCoverImgUrl] = React.useState<string | undefined>(
    props.post?.cover_image || ""
  );
  const [showImagePicker, setShowImagePicker] = React.useState(false);

  const blogsQuery = useBlogsQuery();
  const postsQuery = usePostsQuery();

  const blogQuery = useBlogQuery(blogId);

  const title = watch("title");
  const published = watch("published");

  useEffect(() => {
    setValue("slug", generateSlug(title || ""));
  }, [title, setValue]);

  const editor = useEditor({
    content: props.post?.content || "",
    editorProps: {
      editable: () => !props.readOnly || false,
      handlePaste: (view, event) => {
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
      TiptapLink,
      Placeholder.configure({
        placeholder: "Start writing...",
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
    const slugHasChanged = data.slug !== props.post?.slug;

    props.onSave({
      content,
      title: data.title,
      slug: data.slug,
      cover_image: data.cover_image || "",
      published: data.published,
    });

    if (slugHasChanged) {
      router.push(`/blogs/${blogId}/post/${data.slug}`);
    }
  });

  function onCoverImageSelect(image: string) {
    setCoverImgUrl(image);
    setValue("cover_image", image);
  }

  return (
    <div className="bg-zinc-50 pb-40">
      <form
        onSubmit={formSubmit}
        className="sticky top-0 z-20 flex w-full items-center justify-between border-b bg-zinc-50 px-3 py-1.5 text-zinc-800"
      >
        <div className="flex items-center gap-1 rounded-xl text-sm font-medium tracking-tight text-zinc-800">
          {blogsQuery.isLoading ? null : (
            <DropdownMenu>
              <div className="flex items-center">
                <Button size="icon" variant={"ghost"} asChild>
                  <Link href={`/blogs/${blogQuery.data?.id}/posts`}>
                    <CornerUpLeft size="16" />
                  </Link>
                </Button>
                <DropdownMenuTrigger asChild>
                  <Button variant={"ghost"}>
                    <span className="flex h-6 w-6 items-center justify-center text-lg">
                      {blogQuery.data?.emoji}
                    </span>
                    <span>{blogQuery.data?.title}</span>
                  </Button>
                </DropdownMenuTrigger>
              </div>
              <DropdownMenuContent className="-mt-1 max-w-[240px]">
                {blogsQuery.data?.map((blog) => (
                  <DropdownMenuItem key={blog.id} asChild>
                    <Link
                      href={`/blogs/${blog.id}/posts`}
                      className="flex gap-2 px-2 py-1 hover:bg-zinc-100"
                    >
                      <span>{blog.emoji}</span>
                      <span>{blog.title}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href={`/blogs/`}
                    className="flex gap-2 px-2 py-1 hover:bg-zinc-100"
                  >
                    <List size="14" />
                    <span>All blogs</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <div className="text-zinc-300">
            <ChevronRight size="16" />
          </div>

          {postsQuery.isLoading ? null : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"ghost"}>
                  <div className="flex items-center gap-1.5 rounded-md p-1.5 hover:bg-zinc-100">
                    <span>{props.post?.title || title || "New post"}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="-mt-1 max-w-[240px]">
                {postsQuery.data?.posts?.map((post) => (
                  <DropdownMenuItem key={post.id} asChild>
                    <Link
                      href={`/blogs/${blogId}/post/${post.slug}`}
                      className="flex gap-2 px-2 py-1 hover:bg-zinc-100"
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
            <input
              type="checkbox"
              id="published"
              {...register("published")}
              className="h-4 w-4 rounded-lg border-none bg-transparent p-2 text-zinc-800 outline-none transition-all hover:bg-zinc-50 focus-visible:bg-zinc-100"
            />
            Publish
          </Label>
          <Sheet>
            <SheetTrigger asChild>
              <Button type="button" title="post settings" variant="ghost">
                <Settings2 size={16} /> Settings
              </Button>
            </SheetTrigger>
            <SheetContent>
              <EditorSettings
                onSave={() => {
                  // TO DO - save settings
                }}
              ></EditorSettings>
            </SheetContent>
          </Sheet>
          <Button type="submit">
            <SaveIcon size={16} />
            Save
          </Button>
        </div>
      </form>
      <div className="mx-auto mt-2 flex w-full max-w-2xl flex-col px-2 pb-40">
        <div className="relative mt-2 flex items-center justify-center bg-zinc-100">
          {coverImgUrl && (
            <button
              className="absolute -right-2 -top-2 z-10 rounded-full border bg-white p-1 shadow-sm"
              type="button"
              onClick={() => {
                setCoverImgUrl("");
                setValue("cover_image", "");
              }}
            >
              <IoClose />
            </button>
          )}
          <img className="max-h-96" src={coverImgUrl || ""} alt="" />
        </div>
        <div className="group mt-4 pb-2">
          <div className="flex w-full justify-between gap-2 transition-all">
            <label className="flex w-full items-center gap-2" htmlFor="slug">
              <input
                placeholder="a-great-title"
                type="text"
                {...register("slug")}
                className="w-full rounded-lg bg-transparent p-2 font-mono text-xs text-zinc-700 outline-none transition-all hover:bg-white focus-visible:bg-white focus-visible:shadow-sm"
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
              <Button
                variant={"ghost"}
                className="text-zinc-600 hover:bg-white"
              >
                <span className="flex gap-1.5 whitespace-nowrap !text-xs">
                  <BsFillImageFill className="h-4 w-4 text-zinc-400" />
                  Cover image
                </span>
              </Button>
            </ImagePicker>
          </div>

          <textarea
            placeholder="A great title"
            {...register("title")}
            style={{ resize: "none" }}
            className="mt-1 w-full max-w-2xl rounded-xl border-none bg-transparent p-2
            text-4xl
             font-medium text-zinc-800 outline-none transition-all hover:bg-white focus-visible:bg-white focus-visible:shadow-sm"
          />
        </div>
        <div className="group">
          <div className="sticky top-14 z-10">
            <EditorMenu editor={editor} />
          </div>
          <div
            onClick={() => {
              editor?.commands.focus();
            }}
            className="prose prose-p:text-lg prose-h2:font-semibold -mt-2 min-h-[700px] cursor-text rounded-lg py-1.5 font-light leading-10 tracking-tight transition-all"
          >
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>
    </div>
  );
};
