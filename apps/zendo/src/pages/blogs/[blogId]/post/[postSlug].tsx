import { useRouter } from "next/router";
import { Editor, EditorContent, JSONContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";
import {
  BoldIcon,
  CodeIcon,
  ItalicIcon,
  PenLine,
  Pencil,
  SaveIcon,
  Strikethrough,
  Trash,
  Trash2Icon,
  Undo2,
} from "lucide-react";
import { PiArrowBendUpLeftBold, PiCodeBlock } from "react-icons/pi";
import Heading from "@tiptap/extension-heading";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createAPIClient } from "@/lib/app/api";
import { ContentRenderer } from "@/components/Content/ContentRenderer";
import Spinner from "@/components/Spinner";
import { CgArrowTopLeft, CgWebsite } from "react-icons/cg";
import { BsFillImageFill } from "react-icons/bs";
import Link from "next/link";
import { ImagePicker } from "@/components/Images/ImagePicker";
import { Button } from "@/components/ui/button";
import { BlogImage } from "@/lib/types/BlogImage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ZendoEditor } from "@/components/Editor/ZendoEditor";

// function EditorMenuButton({
//   children,
//   active,
//   ...props
// }: {
//   children: React.ReactNode;
//   active: boolean;
// } & React.ComponentPropsWithoutRef<"button">) {
//   const className = `p-2 rounded-md hover:bg-slate-100/80 text-slate-400 hover:text-slate-600 ${
//     active ? "text-orange-500" : ""
//   }`;

//   return (
//     <button type="button" className={className} {...props}>
//       {children}
//     </button>
//   );
// }

// function EditorMenu({ editor }: { editor: Editor | null }) {
//   const SIZE = 18;
//   const menuButtons = [
//     {
//       icon: <BoldIcon size={SIZE} />,
//       command: () => editor?.chain().focus().toggleBold().run(),
//     },
//     {
//       icon: <ItalicIcon size={SIZE} />,
//       command: () => editor?.chain().focus().toggleItalic().run(),
//     },
//     {
//       icon: <Strikethrough size={SIZE} />,
//       command: () => editor?.chain().focus().toggleStrike().run(),
//     },
//     {
//       icon: <CodeIcon size={SIZE} />,
//       command: () => editor?.chain().focus().toggleCode().run(),
//     },
//     {
//       icon: <PiCodeBlock size={SIZE} />,
//       command: () => editor?.chain().focus().toggleCodeBlock().run(),
//     },
//   ];

//   return (
//     <div className="flex rounded-2xl bg-white p-1">
//       {menuButtons.map(({ icon, command }, i) => (
//         <EditorMenuButton
//           active={editor?.isActive(command) || false}
//           key={i}
//           onClick={() => command()}
//         >
//           {icon}
//         </EditorMenuButton>
//       ))}
//     </div>
//   );
// }

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
    id: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    blog_id: z.string(),
    user_id: z.string(),
    cover_image: z.string().optional(),
    content: z.any(),
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

  const { data: posts, error: postsError } = useQuery(
    ["posts", router.query.blogId],
    () => api.posts.getAll(blogId)
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
    onSuccess: () => {
      window.location.reload();
    },
  });

  async function handleDeleteClick() {
    if (!confirm("Are you sure you want to delete this post?")) return;
    await deletePost.mutateAsync();
    router.push(`/blogs/${blogId}/posts`);
  }

  const updatePost = useMutation({
    mutationFn: (data: {
      title: string;
      published: boolean;
      slug: string;
      id: string;
      created_at: string;
      updated_at: string;
      blog_id: string;
      user_id: string;
      cover_image?: string;
      content?: any;
    }) => api.posts.update(blogId, postSlug, data),
    onSuccess: () => {
      window.location.reload();
    },
  });

  function onCoverImageSelect(image: BlogImage) {
    if (!post) return;

    const newPost = {
      ...post,
      cover_image: image.url,
    };
    updatePost.mutate(newPost);
  }

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

  if (isLoading) {
    return (
      <div className="flex-center p-12">
        <Spinner />
      </div>
    );
  }
  return (
    <div className="flex min-h-screen w-full flex-col bg-white pb-32">
      {/* {editable && (
        <>
          <form
            onSubmit={onSubmit}
            className="flex w-full items-center justify-between border-b p-1.5"
          >
            <div className="flex gap-2 rounded-xl">
              <Button
                variant="ghost"
                size={"icon"}
                onClick={() => setEditable(false)}
              >
                <PiArrowBendUpLeftBold />
              </Button>
              <Button
                size={"icon"}
                variant={"ghost"}
                type="button"
                onClick={handleDeleteClick}
              >
                <Trash size="16" />
              </Button>
            </div>
            <div className="actions">
              <Label
                className="mr-2 flex items-center gap-2 font-semibold"
                htmlFor="published"
              >
                <Checkbox
                  id="published"
                  {...register("published")}
                  className="h-5 w-5 shadow-sm"
                />
                Publish
              </Label>

              <Button variant="secondary">
                <CgWebsite />
                SEO
              </Button>
              <Button type="submit">
                <SaveIcon color="white" />
                Save
              </Button>
            </div>
          </form>
          <div className="mx-auto mt-2 flex w-full max-w-2xl flex-col">
            <div className="flex items-center justify-center bg-slate-100">
              <img className="max-h-96" src={post?.cover_image || ""} />
            </div>
            <div className="group mt-4 border-b border-slate-100 pb-2">
              <div className="flex w-full justify-between gap-2 transition-all">
                <label className="flex w-full items-center" htmlFor="slug">
                  <input
                    type="text"
                    {...register("slug")}
                    className="w-full rounded-md bg-slate-50 p-2 font-mono text-xs outline-none"
                  />
                </label>
                <ImagePicker onSelect={onCoverImageSelect}>
                  <Button asChild variant={"secondary"} size="sm">
                    <div>
                      <BsFillImageFill className="h-4 w-4" />
                      Cover image
                    </div>
                  </Button>
                </ImagePicker>
              </div>

              <input
                type="text"
                {...register("title")}
                className="mt-1 w-full max-w-2xl whitespace-break-spaces border-none bg-transparent text-4xl font-medium outline-none hover:bg-white focus:bg-white"
              />
            </div>
            <div className="prose prose-h2:font-medium group">
              <div className="border-b border-slate-100 transition-all">
                <EditorMenu editor={editor} />
              </div>
              <div className="-mt-2">
                <EditorContent editor={editor} placeholder="Something great" />
              </div>
            </div>
          </div>
        </>
      )}

      {!editable && (
        <div className="flex-grow overflow-y-auto">
          <div className="flex flex-col">
            <div className="flex items-center justify-between p-1.5">
              <Button asChild variant={"ghost"} size={"icon"}>
                <Link href={`/blogs/${blogId}/posts`}>
                  <Undo2 />
                </Link>
              </Button>
              <div>
                <Button variant={"ghost"} onClick={toggleEditable}>
                  <PenLine /> Edit
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center bg-slate-100">
              <img
                src={post?.cover_image || ""}
                className="max-h-96 object-cover"
              />
            </div>
            <div className="mx-auto mt-4 w-full max-w-2xl">
              <div>
                <span className="p-2 font-mono text-sm text-slate-500">
                  {post?.slug}
                </span>
                <h1 className="px-2 text-3xl font-medium">{post?.title}</h1>
              </div>
              <ContentRenderer content={post?.content} />
            </div>
          </div>
        </div>
      )} */}

      <ZendoEditor
        onSave={() => {}}
        onDelete={() => {}}
        readOnly={true}
        post={post}
      />
    </div>
  );
}
