/* eslint-disable @next/next/no-img-element */
import { EditorContent, ReactNodeViewRenderer, useEditor } from "@tiptap/react";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  SaveIcon,
  List,
  CornerUpLeft,
  X,
  ChevronUp,
  Info,
  Loader2,
  Plus,
} from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { ImagePicker } from "../Images/ImagePicker";
import { BsFillImageFill } from "react-icons/bs";
import TiptapImage from "@tiptap/extension-image";
import StarterKit from "@tiptap/starter-kit";
import { handleImagePaste, UploadImagesPlugin } from "./upload-image";
import { generateSlug } from "@/lib/utils/slugs";
import { Label } from "../ui/label";
import { useRouter } from "next/router";
import { useBlogQuery, useBlogsQuery } from "@/queries/blogs";
import Underline from "@tiptap/extension-underline";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { Calendar } from "../ui/calendar";
import { usePostsQuery } from "@/queries/posts";
import { IoClose } from "react-icons/io5";
import TiptapLink from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { toast } from "sonner";
import { Database } from "@/types/supabase";
import { useBlogTags } from "./Editor.queries";
import { TagPicker } from "../Tags/TagPicker";
import { cn } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";
import {
  SlashCommand,
  getSlashCommandSuggestions,
} from "./slash-commands/slash-commands";
import { EditorMenu } from "./EditorMenu";
import { useCategories } from "@/queries/categories";
import { EditorCategoryPicker } from "./editor-category-picker";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { EditorMediaNode } from "./editor-media-node";
import { TrailingNode } from "./trailing-node";
import { useBlogId } from "@/hooks/use-blog-id";
import { API } from "app/utils/api-client";
import { useAuthors } from "@/queries/authors";
import { Skeleton } from "../ui/skeleton";
import { CreateAuthorDialog } from "@/pages/blogs/[blogId]/authors";
import { useSubscriptionQuery } from "@/queries/subscription";
import Head from "next/head";

const formSchema = z.object({
  title: z.string(),
  slug: z.string(),
  cover_image: z.string().optional(),
  content: z.any(),
  excerpt: z.string().optional(),
  category_id: z.number().nullable(),
});

type FormData = z.infer<typeof formSchema>;

type OnSaveData = {
  content?: any;
  html_content?: string;
  title: string;
  slug: string;
  cover_image?: string;
  published: boolean;
  metadata?: any;
  excerpt?: string;
  category_id: number | null;
  tags?: {
    id: string;
    name: string;
    slug: string;
  }[];
  published_at?: string;
  authors?: number[];
};

type Props = {
  loading?: boolean;
  onSave: (data: OnSaveData) => Promise<void>;
  readOnly?: boolean;
  post?: Database["public"]["Tables"]["posts"]["Row"];
  tags?: { id: string; name: string; slug: string }[];
  authors?: { id: number; name: string; image_url: string | null }[];
  autoCompleteSlug?: boolean;
  showPublishedDialog?: boolean;
  categories?: { id: number; name: string }[];
};

export const ZendoEditor = (props: Props) => {
  const editorLoading = props.loading || false;
  const { register, handleSubmit, setValue, watch, getValues } =
    useForm<FormData>({
      defaultValues: {
        title: props.post?.title || "",
        slug: props.post?.slug || "",
        cover_image: props.post?.cover_image || "",
        excerpt: props.post?.excerpt || "",
        category_id: props.post?.category_id || null,
      },
    });
  const router = useRouter();
  const blogId = useBlogId();
  const blogTags = useBlogTags({ blogId });
  const [published, setPublished] = React.useState(
    props.post?.published || false
  );
  const { data: categories, isLoading: isCategoriesLoading } =
    useCategories(blogId);

  /**
   * Authors State
   */
  const { data: authors, isLoading: isAuthorsLoading } = useAuthors({ blogId });
  const [selectedAuthors, setSelectedAuthors] = React.useState<number[]>(
    props.authors?.map((a) => a.id) || []
  );

  const [metadata, setMetadata] = React.useState(props.post?.metadata || []);
  const today = new Date().toISOString();
  const [publishedAt, setPublishedAt] = React.useState<string | undefined>(
    props.post?.published_at || today
  );

  const [coverImgUrl, setCoverImgUrl] = React.useState<string | undefined>(
    props.post?.cover_image || ""
  );
  const [showImagePicker, setShowImagePicker] = React.useState(false);
  const [showTagPicker, setShowTagPicker] = React.useState(false);

  const blogsQuery = useBlogsQuery({ enabled: true });
  const postsQuery = usePostsQuery();

  const blogQuery = useBlogQuery(blogId);

  // Get subscription status
  const subscription = useSubscriptionQuery();
  const isProPlan = subscription.data?.plan === "pro";

  const title = watch("title");
  const slug = watch("slug");

  const [publishedDialog, setPublishedDialog] = useState(
    !!router.query.pub || false
  );

  useEffect(() => {
    if (!!router.query.pub) {
      setPublishedDialog(true);
    }
  }, [router.query.pub]);

  useEffect(() => {
    // When a user writes a space or a '/', change it for a dash
    const newSlug = slug.replace(/\s/g, "-").replace(/\//g, "-");
    setValue("slug", newSlug);
  }, [slug, setValue]);

  useEffect(() => {
    if (props.autoCompleteSlug) {
      setValue("slug", generateSlug(title));
    }
  }, [title, props.autoCompleteSlug, setValue]);

  async function uploadImage(file: File, blogId: string): Promise<string> {
    const isVideo = file.type.startsWith("video/");

    // 1. Get Signed URL from backend
    const signedUrlRes = await API().v2.blogs[":blog_id"].media[
      "upload-url"
    ].$get({
      param: {
        blog_id: blogId,
      },
      query: {
        original_file_name: file.name,
        size_in_bytes: file.size.toString(),
        content_type: file.type,
      },
    });

    if (!signedUrlRes.ok) {
      const errorData = await signedUrlRes.json();
      throw new Error(
        (errorData as { error: string }).error || "Failed to get upload URL"
      );
    }

    // Assert type after checking res.ok
    const { signedUrl, uniqueFilename } = (await signedUrlRes.json()) as {
      signedUrl: string;
      uniqueFilename: string;
    };

    // 2. Upload file to R2 using the signed URL
    const uploadResponse = await fetch(signedUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    if (!uploadResponse.ok) {
      // Basic error handling, could parse XML like before if needed
      console.error("R2 Upload Error Status:", uploadResponse.status);
      console.error("R2 Upload Error Text:", await uploadResponse.text());
      throw new Error("Failed to upload file to storage.");
    }

    // 3. Confirm Upload with backend
    const confirmRes = await API().v2.blogs[":blog_id"].media[
      "confirm-upload"
    ].$post({
      param: {
        blog_id: blogId,
      },
      json: {
        fileName: uniqueFilename,
        contentType: file.type,
        sizeInBytes: file.size,
      },
    });

    if (!confirmRes.ok) {
      const confirmError = await confirmRes.json();
      // Log error, maybe attempt cleanup of R2 object?
      console.error("Confirm Upload Error:", confirmError);
      throw new Error(
        (confirmError as { error: string }).error || "Failed to confirm upload"
      );
    }

    const confirmData = await confirmRes.json();
    // Return the final public URL provided by the confirmation endpoint
    return (confirmData as { url: string }).url;
  }

  const editor = useEditor(
    {
      content: (props.post?.content as any) || "",
      editorProps: {
        editable: () => !props.readOnly || false,
        handlePaste: (view, event) =>
          handleImagePaste(view, event, uploadImage, blogId, isProPlan),
        handleDOMEvents: {
          keydown: (view, event) => {
            // if slash command is open, don't handle keydown events
            if (["ArrowUp", "ArrowDown", "Enter"].includes(event.key)) {
              const slashCommand = document.querySelector("#slash-command");
              if (slashCommand) {
                return true;
              }
            }
          },
        },
      },
      extensions: [
        StarterKit.configure({
          heading: {
            levels: [2, 3, 4, 5, 6],
          },
        }),
        TiptapLink.configure({
          openOnClick: false,
          HTMLAttributes: {
            target: "_blank",
            rel: "noopener noreferrer",
          },
          linkOnPaste: true,
        }),
        Placeholder.configure({
          placeholder: "Start writing or use `/` for commands",
        }),
        SlashCommand.configure({
          suggestion: getSlashCommandSuggestions([]),
        }),
        Underline,
        TrailingNode,
        TiptapImage.extend({
          addAttributes() {
            return {
              ...this.parent?.(),
              src: {
                default: null,
                renderHTML: (attributes) => ({
                  src: attributes.src,
                }),
              },
              alt: {
                default: null,
                renderHTML: (attributes) => ({
                  alt: attributes.alt,
                }),
              },
              isVideo: {
                default: false,
                renderHTML: (attributes) => ({
                  "data-is-video": attributes.isVideo,
                }),
              },
              isYoutube: {
                default: false,
                renderHTML: (attributes) => ({
                  "data-is-youtube": attributes.isYoutube,
                }),
              },
              videoDimensions: {
                default: null,
                renderHTML: (attributes) => ({
                  "data-video-dimensions": attributes.videoDimensions,
                }),
              },
            };
          },
          renderHTML({ HTMLAttributes, node }) {
            const isVideo = node.attrs.isVideo === "true";
            const isYoutube = node.attrs.isYoutube === "true";

            if (isYoutube) {
              return [
                "div",
                {
                  class: "",
                },
                [
                  "iframe",
                  {
                    ...HTMLAttributes,
                    class: "zb-youtube-iframe",
                    title: "YouTube video player",
                    allow:
                      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
                    allowFullScreen: true,
                    style: "aspect-ratio: 16 / 9; width: 100%; height: 100%;",
                  },
                ],
              ];
            }

            if (isVideo) {
              const videoDimensions = node.attrs.videoDimensions
                ? JSON.parse(node.attrs.videoDimensions)
                : null;
              return [
                "video",
                {
                  ...HTMLAttributes,
                  controls: true,
                  playsInline: true,
                  width: videoDimensions?.width || undefined,
                  height: videoDimensions?.height || undefined,
                  style: videoDimensions
                    ? `aspect-ratio: ${videoDimensions.width} / ${videoDimensions.height}; width: 100%; max-width: 100%;`
                    : undefined,
                },
              ];
            }

            return [
              "img",
              {
                ...HTMLAttributes,
              },
            ];
          },
          addNodeView() {
            return ReactNodeViewRenderer(EditorMediaNode);
          },
          addProseMirrorPlugins() {
            return [
              UploadImagesPlugin({
                imageClass: "opacity-50 border border-red-500",
              }),
            ];
          },
        }).configure({
          inline: false,
          allowBase64: true,
          HTMLAttributes: {
            class: "rounded-lg",
          },
        }),
      ],
    },
    [blogId]
  );

  const formSubmit = handleSubmit(async (data) => {
    const content = editor?.getJSON() || {};
    const html_content = editor?.getHTML() || "";
    const { title, slug, category_id } = data;

    if (!title || !slug) {
      toast.error("Title and slug are required");
      return;
    }

    props.onSave({
      content,
      html_content,
      title: data.title,
      slug: data.slug,
      cover_image: data.cover_image || "",
      published,
      published_at: publishedAt || new Date().toISOString(),
      metadata,
      tags,
      excerpt: data.excerpt,
      category_id,
      authors: selectedAuthors,
    });
  });

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
    return () => {
      document.removeEventListener("keydown", handleSave);
    };
  });

  function onCoverImageSelect(image: string) {
    setCoverImgUrl(image);
    setValue("cover_image", image);
  }

  useEffect(() => {
    const titleEl = document.getElementById("title-input");
    if (!titleEl) return;

    titleEl.style.height = "1px";
    titleEl.style.height = titleEl?.scrollHeight + "px";
  }, [title]);

  const [showPublishedAtDropdown, setShowPublishedAtDropdown] = useState(false);

  const [showPropertyList, setShowPropertyList] = useState(true);

  const [tags, setTags] = useState(props.tags || []);

  return (
    <div className="relative min-h-screen pb-24">
      <Head>
        <title>{props.post?.title || title || "Zenblog - New post"}</title>
        <link rel="icon" href="/static/favicon.ico" />
      </Head>
      {editorLoading && (
        <div className="absolute inset-0 z-30 bg-zinc-50/50 backdrop-blur-sm">
          <div className="flex h-screen items-center justify-center">
            <Loader2 size={32} className="animate-spin text-orange-500" />
          </div>
        </div>
      )}
      <form
        onSubmit={formSubmit}
        className="sticky top-0 z-20 flex w-full items-center justify-end bg-white py-1.5 pl-1.5 pr-3 text-zinc-800 md:justify-between"
      >
        <div className="mr-auto flex items-center gap-1 rounded-xl text-sm font-medium tracking-tight text-zinc-800">
          <Button size="icon" variant={"ghost"} asChild>
            <Link href={`/blogs/${blogQuery.data?.id}/posts`}>
              <CornerUpLeft size="16" />
            </Link>
          </Button>
          <div className="hidden items-center gap-1 md:flex">
            {blogsQuery.isLoading ? null : (
              <DropdownMenu>
                <div className="flex items-center">
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

            <div className="text-zinc-300">/</div>

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
                  {postsQuery.data?.pages
                    .flatMap((page) => page)
                    .map((post) => (
                      <DropdownMenuItem key={post?.slug} asChild>
                        <Link
                          href={`/blogs/${blogId}/post/${post?.slug}`}
                          className="flex gap-2 px-2 py-1 hover:bg-zinc-100"
                        >
                          <span className="text-xs">
                            {post?.published ? "🟢" : "🟠"}
                          </span>
                          <span>{post?.title}</span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
        <div className="flex w-full items-center justify-end gap-2">
          <div className="flex items-center">
            <Checkbox
              id="published"
              defaultChecked={published}
              onCheckedChange={(e) => {
                setPublished(!!e);
              }}
              checked={published}
            />
            <Label
              className="flex cursor-pointer items-center p-2  text-xs font-medium text-zinc-600 transition-all hover:text-zinc-800"
              htmlFor="published"
            >
              Publish
            </Label>
          </div>
          <Button type="submit" variant={"default"}>
            <SaveIcon size={16} />
            Save
          </Button>
        </div>
      </form>
      <div className="mx-auto flex w-full max-w-3xl flex-col rounded-md bg-white px-2 pb-6 md:px-8">
        {coverImgUrl && (
          <div className="relative mt-2 flex items-center justify-center">
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

            <img
              className="w-full rounded-xl object-contain shadow-lg"
              src={coverImgUrl || ""}
              alt=""
            />
          </div>
        )}
        <div className="group mx-auto w-full max-w-3xl px-2 pb-2 md:px-8">
          <div className="mt-8 flex w-full items-end justify-between gap-4  transition-all">
            <ImagePicker
              open={showImagePicker}
              onOpenChange={setShowImagePicker}
              onSelect={(img) => {
                onCoverImageSelect(img.url || "");
                setShowImagePicker(false);
              }}
              onCancel={() => {}}
              showFooter={false}
            >
              <Button
                variant={"ghost"}
                className="px-0 text-zinc-500 hover:bg-white"
              >
                <span className="flex gap-1.5 whitespace-nowrap !text-xs">
                  <BsFillImageFill className="h-4 w-4 text-zinc-400" />
                  Cover image
                </span>
              </Button>
            </ImagePicker>
          </div>

          <textarea
            id="title-input"
            placeholder="A great title"
            {...register("title")}
            style={{ resize: "none" }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                editor?.commands.focus();
              }
            }}
            className="mt-1 w-full overflow-hidden
            rounded-xl bg-transparent text-4xl font-semibold text-zinc-900 outline-none"
          />
          <AnimatePresence>
            {showPropertyList && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="mt-6 grid grid-cols-4 gap-2 gap-y-2 overflow-hidden text-zinc-500"
              >
                <EditorPropLabel
                  className="items-center"
                  tooltip="The slug is a unique identifier for your post, used in the URL."
                >
                  Slug
                </EditorPropLabel>
                <EditorPropValue>
                  <div className="flex w-full items-center gap-1 py-1 pl-3 pr-1">
                    <textarea
                      className="field-sizinc w-full resize-none truncate bg-transparent text-xs font-semibold outline-none"
                      rows={1}
                      placeholder="a-great-title"
                      value={slug}
                      onChange={(e) => {
                        setValue("slug", e.target.value);
                      }}
                    />
                  </div>
                </EditorPropValue>
                <EditorPropLabel tooltip="One or more authors can be assigned to a post.">
                  Authors
                </EditorPropLabel>
                <EditorPropValue>
                  <AuthorSelector
                    authors={authors || []}
                    value={selectedAuthors}
                    onChange={(authors) => {
                      setSelectedAuthors(authors);
                    }}
                    isLoading={isAuthorsLoading}
                  />
                </EditorPropValue>
                <EditorPropLabel tooltip="The date your post was published.">
                  Published at
                </EditorPropLabel>
                <EditorPropValue
                  onClick={() => setShowPublishedAtDropdown(true)}
                  className="relative"
                >
                  <DropdownMenu
                    onOpenChange={setShowPublishedAtDropdown}
                    open={showPublishedAtDropdown}
                    modal={false}
                  >
                    <DropdownMenuTrigger className="w-full px-3 py-1 text-left text-xs font-semibold">
                      {publishedAt
                        ? new Date(publishedAt).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "Empty"}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <Calendar
                        mode="single"
                        selected={
                          publishedAt ? new Date(publishedAt) : undefined
                        }
                        onSelect={(date) => {
                          setPublishedAt(date?.toISOString() || "");
                          setShowPublishedAtDropdown(false);
                        }}
                        initialFocus
                      />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </EditorPropValue>
                <EditorPropLabel tooltip="A short description of your post. Recommended to be 155 characters or less.">
                  Excerpt
                </EditorPropLabel>
                <EditorPropValue>
                  <textarea
                    className="field-size-zinc w-full resize-none bg-transparent px-3 py-1 text-xs font-semibold outline-none"
                    rows={3}
                    placeholder="A short description of your post. Recommended to be 155 characters or less."
                    onChange={(e) => {
                      setValue("excerpt", e.target.value);
                    }}
                    value={watch("excerpt") || ""}
                  />
                  {watch("excerpt") && (
                    <div className="absolute -bottom-4 right-2 text-xs text-zinc-400 opacity-0 transition-all group-focus-within:opacity-100">
                      {(watch("excerpt") || "").length}/155
                    </div>
                  )}
                </EditorPropValue>
                <EditorPropLabel tooltip="Posts can have one category. Good for organizing your posts and creating more pages in your blog.">
                  Category
                </EditorPropLabel>
                <EditorPropValue>
                  <EditorCategoryPicker
                    isLoading={isCategoriesLoading}
                    categories={categories || []}
                    onChange={(e) => {
                      setValue("category_id", e);
                    }}
                    value={watch("category_id")}
                  />
                </EditorPropValue>
                <EditorPropLabel tooltip="Posts can have multiple tags. Good for finding related posts.">
                  Tags
                </EditorPropLabel>
                <EditorPropValue onClick={() => setShowTagPicker(true)}>
                  <div className="flex items-center gap-1 py-1 pl-2 pr-3 text-left">
                    <TagPicker
                      allTags={blogTags.data || []}
                      selectedTags={tags || []}
                      onChange={(newTags) => {
                        setTags(newTags);
                      }}
                      blogId={blogId}
                      open={showTagPicker}
                      onOpenChange={setShowTagPicker}
                    >
                      <span className="mt-6"></span>
                    </TagPicker>
                    <div className="-mr-2">
                      <span className="text-xs font-semibold">
                        {tags.length === 0 && "Select some tags"}
                      </span>
                      {tags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1">
                          {tags?.map((tag) => (
                            <span
                              key={tag.id}
                              className="flex items-center rounded-md bg-zinc-100  text-xs font-medium"
                            >
                              <div className="p-1 pl-2 pr-0">{tag.name}</div>
                              <button
                                tabIndex={-1}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setTags(tags?.filter((t) => t.id !== tag.id));
                                }}
                                className="rounded-full p-1 pr-2"
                              >
                                <X size="12" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </EditorPropValue>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            variant={"ghost"}
            className="mt-1 flex items-center justify-center px-0 py-4 text-center opacity-0 transition-opacity hover:opacity-100 group-hover:opacity-100 md:w-auto md:text-left"
            onClick={() => setShowPropertyList(!showPropertyList)}
          >
            <ChevronUp
              className={cn(
                "text-zinc-400",
                showPropertyList ? "" : "rotate-180"
              )}
              size={14}
            />
            {showPropertyList ? "Hide properties" : "Show properties"}
          </Button>
        </div>
        <div
          className="group cursor-text"
          onClick={() => {
            editor?.commands.focus();
          }}
        >
          <div className="sticky top-10 z-10 px-3">
            <EditorMenu editor={editor} />
          </div>
          <div
            onClick={() => {
              editor?.commands.focus();
            }}
            className="prose prose-p:text-lg prose-headings:font-medium prose-headings:mt-6 !prose-code:p-0 prose-li:[&_p]:my-1 mx-auto mt-4 min-h-[500px] w-full max-w-3xl  cursor-text rounded-lg px-2 font-normal tracking-normal transition-all md:px-6"
          >
            {/* <pre>{JSON.stringify(editor?.getHTML(), null, 2)}</pre> */}
            <EditorContent className="w-full" editor={editor} />
          </div>
        </div>
      </div>
    </div>
  );
};

function EditorPropLabel({
  children,
  tooltip,
  className,
}: {
  children: React.ReactNode;
  tooltip: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "col-span-4 mt-4 flex items-start gap-1 px-3 py-1 font-medium md:col-span-1 md:mt-0 md:px-0",
        className
      )}
    >
      <div className="group/label flex items-center gap-1">
        {children}
        <TooltipProvider>
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <Info
                size={15}
                className="mt-0.5 text-zinc-400 opacity-0 transition-opacity group-hover/label:opacity-100"
              />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs text-xs">
              {tooltip}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
function EditorPropValue({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative col-span-4 flex min-h-8 cursor-pointer items-center rounded-lg border border-b transition-all focus-within:bg-zinc-100/60 hover:bg-zinc-100/60 hover:text-zinc-800 md:col-span-3 md:border-none",
        className
      )}
    >
      {children}
    </div>
  );
}

export function AuthorSelector({
  authors,
  onChange,
  value,
  isLoading,
}: {
  authors: { id: number; name: string; image_url: string | null }[]; // author ids
  onChange: (authors: number[]) => void;
  value: number[];
  isLoading: boolean;
}) {
  const getAuthorFromValue = (id: number) => {
    return authors.find((author) => author.id === id);
  };
  const AuthorsLabel = () => {
    if (value.length === 0) {
      return <span className="text-xs font-semibold">Select authors</span>;
    }

    return (
      <span className="flex items-center gap-2 text-xs font-semibold">
        {isLoading ? (
          <span className="flex items-center gap-1">
            <div className="h-4 w-4 rounded-full bg-zinc-200"></div>
            <Skeleton />
          </span>
        ) : (
          value.map((author) => (
            <span key={author} className="flex items-center gap-1">
              {getAuthorFromValue(author)?.image_url ? (
                <img
                  src={getAuthorFromValue(author)?.image_url || ""}
                  alt={getAuthorFromValue(author)?.name || ""}
                  className="h-6 w-6 rounded-full border object-cover"
                />
              ) : (
                <div className="h-4 w-4 rounded-full bg-zinc-200"></div>
              )}
              {getAuthorFromValue(author)?.name}
            </span>
          ))
        )}
      </span>
    );
  };

  const [open, setOpen] = React.useState(false);

  const [createAuthorOpen, setCreateAuthorOpen] = React.useState(false);

  return (
    <>
      <CreateAuthorDialog
        hideTrigger
        open={createAuthorOpen}
        setOpen={setCreateAuthorOpen}
      />
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} className="">
            <AuthorsLabel />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-[200px] space-y-px">
          <div className="flex items-center justify-between">
            <span className="px-2 text-xs font-semibold">Authors</span>
            <Button
              variant={"ghost"}
              size={"icon"}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setCreateAuthorOpen(true);
                setOpen(false);
              }}
            >
              <Plus size={14} />
            </Button>
          </div>
          {authors.length === 0 && (
            <DropdownMenuItem className="text-xs font-semibold">
              No authors found
            </DropdownMenuItem>
          )}
          {authors.map((author) => (
            <DropdownMenuItem
              key={author.id}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                if (value.includes(author.id)) {
                  onChange(value.filter((id) => id !== author.id));
                } else {
                  onChange([...value, author.id]);
                }
              }}
              className={cn(
                value.includes(author.id) && "bg-slate-100 text-slate-800"
              )}
            >
              <div className="flex items-center gap-2">
                {author.image_url ? (
                  <img
                    src={author.image_url || ""}
                    alt={author.name}
                    className="h-5 w-5 rounded-full"
                  />
                ) : (
                  <div className="h-5 w-5 rounded-full bg-slate-200"></div>
                )}
                <span>{author.name}</span>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
