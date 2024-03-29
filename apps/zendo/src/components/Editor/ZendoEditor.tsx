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
import { useSubscriptionQuery } from "@/queries/subscription";
import { toast } from "sonner";
import { Database } from "@/types/supabase";
import { useBlogTags } from "./Editor.queries";

const formSchema = z.object({
  title: z.string(),
  published: z.boolean(),
  slug: z.string(),
  cover_image: z.string().nullable(),
  content: z.any(),
});

type FormData = z.infer<typeof formSchema>;

type OnSaveData = {
  content?: any;
  title: string;
  slug: string;
  cover_image?: string;
  published: boolean;
  metadata?: any;
  tags?: string[];
};

type Props = {
  onSave: (data: OnSaveData) => Promise<void>;
  readOnly?: boolean;
  post?: Database["public"]["Tables"]["posts"]["Row"];
  tags?: string[];
  autoCompleteSlug?: boolean;
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
  const subscription = useSubscriptionQuery();
  const blogTags = useBlogTags({ blogId });

  const [metadata, setMetadata] = React.useState(props.post?.metadata || []);
  const [tags, setTags] = React.useState(props.tags || []);

  const isSubscribed = subscription.data?.status === "active";

  const [coverImgUrl, setCoverImgUrl] = React.useState<string | undefined>(
    props.post?.cover_image || ""
  );
  const [showImagePicker, setShowImagePicker] = React.useState(false);

  const blogsQuery = useBlogsQuery();
  const postsQuery = usePostsQuery();

  const blogQuery = useBlogQuery(blogId);

  const title = watch("title");

  useEffect(() => {
    if (props.autoCompleteSlug) {
      setValue("slug", generateSlug(title));
    }
  }, [title, props.autoCompleteSlug, setValue]);

  const editor = useEditor({
    content: (props.post?.content as any) || "",
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
    if (!isSubscribed) {
      alert("You need an active subscription to publish more posts.");
      return;
    }
    const content = editor?.getJSON() || {};
    const { title, slug } = data;

    if (!title || !slug) {
      toast.error("Title and slug are required");
      return;
    }

    props.onSave({
      content,
      title: data.title,
      slug: data.slug,
      cover_image: data.cover_image || "",
      published: data.published,
      metadata,
      tags,
    });
  });

  const [hasChanges, setHasChanges] = React.useState(false);

  useEffect(() => {
    const propsTagsStr = props.tags?.join(",");
    const tagsStr = tags.join(",");

    setHasChanges(propsTagsStr !== tagsStr);
    setHasChanges(props.post?.title !== getValues("title"));
    setHasChanges(props.post?.metadata !== metadata);
    setHasChanges(props.post?.cover_image !== getValues("cover_image"));
    setHasChanges(props.post?.published !== getValues("published"));
    setHasChanges(props.post?.slug !== getValues("slug"));

    editor?.on("transaction", (ctx) => {
      const hasChanged = ctx.transaction.docChanged;
      setHasChanges(hasChanged);
    });
  }, [
    editor,
    props.tags,
    tags,
    props.post?.content,
    props.post?.title,
    props.post?.metadata,
    props.post?.cover_image,
    props.post?.published,
    props.post?.slug,
    getValues,
    metadata,
  ]);

  useEffect(() => {
    // on cmd + enter or cmd + s save the post
    const handleSave = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        formSubmit();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        formSubmit();
      }
    };
    document.addEventListener("keydown", handleSave);

    // prevent users from leaving if they have unsaved changes
    window.onbeforeunload = function (e) {
      if (hasChanges) {
        const confirm = window.confirm(
          "You have unsaved changes, are you sure you want to leave?"
        );

        if (confirm) {
          return;
        } else {
          e.preventDefault();
        }
      }
    };

    return () => {
      document.removeEventListener("keydown", handleSave);
      window.onbeforeunload = null;
    };
  });

  function onCoverImageSelect(image: string) {
    setCoverImgUrl(image);
    setValue("cover_image", image);
  }

  return (
    <div className="bg-zinc-50 pb-24">
      {!isSubscribed && !subscription.isLoading && (
        <>
          <div className="absolute inset-0 z-40 flex items-center justify-center overflow-hidden bg-zinc-100/80">
            <div className="max-w-xs rounded-lg border bg-white p-3 shadow-sm">
              <span className="text-lg">🙏</span>
              <h2 className="text-lg font-medium">
                You need an active subscription to publish more posts.
              </h2>
              <Link
                className="mt-4 inline-block py-2 text-orange-500 underline"
                href="/account"
              >
                Manage your subscription
              </Link>
            </div>
          </div>
        </>
      )}
      <form
        onSubmit={formSubmit}
        className="sticky top-0 z-20 flex w-full items-center justify-between border-b bg-zinc-50 px-3 py-1.5 text-zinc-800"
      >
        <div className="hidden items-center gap-1 rounded-xl text-sm font-medium tracking-tight text-zinc-800 md:flex">
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
                {postsQuery.data?.map((post) => (
                  <DropdownMenuItem key={post.post_id} asChild>
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
                metadata={metadata as any}
                selectedTags={tags}
                onChange={(data) => {
                  setMetadata(data.metadata);
                  setTags(data.tags);
                }}
              ></EditorSettings>
            </SheetContent>
          </Sheet>
          <Button type="submit" variant={hasChanges ? "default" : "outline"}>
            <SaveIcon size={16} />
            Save
          </Button>
        </div>
      </form>
      <div className="mx-auto mt-2 flex w-full max-w-2xl flex-col px-2 pb-6">
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
        <div className="mt-4 pb-2">
          <div className="flex w-full justify-between transition-all">
            <label
              className="group flex w-full flex-col items-start justify-center gap-1"
              htmlFor="slug"
            >
              <span className="mx-2 text-xs text-zinc-400 opacity-0 transition-all group-focus-within:opacity-100">
                slug
              </span>
              <input
                required
                placeholder="a-great-title"
                type="text"
                {...register("slug")}
                className="w-full rounded-lg border border-transparent bg-transparent p-2 font-mono text-sm text-zinc-700 outline-none transition-all hover:bg-white focus:border-zinc-300 focus-visible:bg-white focus-visible:shadow-sm"
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
            className="mt-1 w-full max-w-2xl rounded-xl bg-transparent p-2
            text-4xl font-medium text-zinc-800 outline-none"
          />
          <div>
            {tags.length > 0 && (
              <div className="flex items-center gap-1">
                <span className="mx-1 font-mono text-xs font-medium text-zinc-500">
                  Tags
                </span>
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border bg-zinc-100 px-2 py-1 font-mono text-xs font-medium"
                  >
                    {blogTags.data?.find((t) => t.id === tag)?.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="group">
          <div className="sticky top-12 z-30">
            <EditorMenu editor={editor} />
          </div>
          <div
            onClick={() => {
              editor?.commands.focus();
            }}
            className="prose prose-p:text-lg prose-h2:font-semibold -mt-2 min-h-[700px] cursor-text rounded-lg py-1.5 font-light leading-10 tracking-normal transition-all"
          >
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>
    </div>
  );
};
