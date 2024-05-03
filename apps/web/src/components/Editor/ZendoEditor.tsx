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
  Tag,
  X,
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
import { TagPicker } from "../Tags/TagPicker";
import { cn } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";

const formSchema = z.object({
  title: z.string(),
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
  tags?: {
    id: string;
    name: string;
    slug: string;
  }[];
  published_at?: string;
};

type Props = {
  onSave: (data: OnSaveData) => Promise<void>;
  readOnly?: boolean;
  post?: Database["public"]["Tables"]["posts"]["Row"];
  tags?: { id: string; name: string; slug: string }[];
  autoCompleteSlug?: boolean;
};

export const ZendoEditor = (props: Props) => {
  const { register, handleSubmit, setValue, watch, getValues } =
    useForm<FormData>({
      defaultValues: {
        title: props.post?.title || "",
        slug: props.post?.slug || "",
        cover_image: props.post?.cover_image || "",
      },
    });
  const router = useRouter();
  const blogId = (router.query.blogId as string) || "demo";
  const subscription = useSubscriptionQuery();
  const blogTags = useBlogTags({ blogId });
  const [published, setPublished] = React.useState(
    props.post?.published || false
  );

  const [metadata, setMetadata] = React.useState(props.post?.metadata || []);
  const [tags, setTags] = React.useState(props.tags || []);
  const [publishedAt, setPublishedAt] = React.useState<string | undefined>(
    props.post?.published_at || ""
  );

  const isSubscribed = subscription.data?.status === "active";

  const [coverImgUrl, setCoverImgUrl] = React.useState<string | undefined>(
    props.post?.cover_image || ""
  );
  const [showImagePicker, setShowImagePicker] = React.useState(false);

  const blogsQuery = useBlogsQuery();
  const postsQuery = usePostsQuery();

  const blogQuery = useBlogQuery(blogId);

  const title = watch("title");
  const slug = watch("slug");

  useEffect(() => {
    // When a user writes a space, change it for a dash
    const newSlug = slug.replace(/\s/g, "-");
    setValue("slug", newSlug);
  }, [slug, setValue]);

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
      published,
      published_at: publishedAt || new Date().toISOString(),
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
    setHasChanges(props.post?.published !== published);
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
    published,
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
        className="sticky top-0 z-20 flex w-full items-center justify-end bg-zinc-50 px-3 py-1.5 text-zinc-800 md:justify-between"
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
              <DropdownMenuContent
                align="start"
                className="-mt-1 max-w-[240px]"
              >
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
              <DropdownMenuContent
                align="start"
                className="-mt-1 max-w-[240px]"
              >
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
          <Checkbox
            id="published"
            defaultChecked={published}
            onCheckedChange={(e) => {
              setPublished(e as any);
            }}
            checked={published}
          />
          <Label
            className="flex cursor-pointer items-center py-1.5 text-xs  font-medium text-zinc-600 transition-all hover:text-zinc-800"
            htmlFor="published"
          >
            {/* <input
              type="checkbox"
              id="published"
              {...register("published")}
              className="h-4 w-4 rounded-lg border-none border-zinc-200 bg-transparent p-2 text-zinc-800 outline-none transition-all hover:bg-zinc-50 focus-visible:bg-zinc-100"
            /> */}
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
                title={title}
                metadata={metadata as any}
                selectedTags={tags}
                blogEmoji={blogQuery.data?.emoji}
                blogTitle={blogQuery.data?.title}
                published_at={publishedAt}
                onChange={(data) => {
                  setMetadata(data.metadata);
                  setTags(data.tags);
                  setPublishedAt(data.published_at);
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
      <div className="mx-auto mt-2 flex w-full max-w-3xl flex-col rounded-md border bg-white  pb-6 pt-2 shadow-md">
        {coverImgUrl && (
          <div className="relative mt-2 flex items-center justify-center border-b">
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

            <img className="max-h-96" src={coverImgUrl || ""} alt="" />
          </div>
        )}

        <div className="px-8 pb-2 pt-1.5">
          <div className="flex w-full items-end justify-between gap-4 transition-all">
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
                className="w-full rounded-lg border border-transparent bg-transparent p-1 font-mono text-sm text-zinc-500 outline-none transition-all hover:bg-white focus:bg-zinc-100"
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
              showFooter={false}
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
            className="mt-1 w-full max-w-2xl rounded-xl bg-transparent
            p-2 text-4xl font-medium text-zinc-800 outline-none focus:bg-zinc-100"
          />
          <div className="group flex gap-0.5">
            {tags.length > 0 && (
              <div className="flex items-center gap-1">
                {tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="flex rounded-full bg-zinc-100 font-mono text-xs font-medium"
                  >
                    <div className="p-1 pl-2 pr-0">
                      {blogTags.data?.find((t) => t.id === tag.id)?.name}
                    </div>
                    <button
                      tabIndex={-1}
                      onClick={() => {
                        setTags(tags.filter((t) => t.id !== tag.id));
                      }}
                      className="rounded-full p-1 pr-2"
                    >
                      <X size="10" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <TagPicker
              allTags={blogTags.data || []}
              selectedTags={tags}
              onChange={(newTags) => {
                setTags(newTags);
              }}
            >
              <button
                tabIndex={-1}
                className={cn(
                  "flex items-center gap-1 rounded-md px-1.5 py-1 text-xs text-zinc-400 opacity-0 transition-all hover:text-zinc-700 group-hover:opacity-100",
                  {
                    "opacity-100": tags.length === 0,
                  }
                )}
              >
                <Tag size="14" className="text-zinc-300" />
                Add tags
              </button>
            </TagPicker>
          </div>
        </div>
        <div className="group">
          <div className="sticky top-10 z-10 border-b px-3">
            <EditorMenu editor={editor} />
          </div>
          <div
            onClick={() => {
              editor?.commands.focus();
            }}
            className="prose prose-p:text-lg prose-h2:font-semibold -mt-2 min-h-[700px] cursor-text rounded-lg px-8 py-1.5 font-light leading-10 tracking-normal transition-all"
          >
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>
    </div>
  );
};
