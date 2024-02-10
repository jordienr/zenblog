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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { toast } from "sonner";

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
  const api = createAPIClient();
  const router = useRouter();
  const queryClient = useQueryClient();

  const blogId = router.query.blogId as string;
  const postSlug = router.query.postSlug as string;

  const {
    data: post,
    isLoading,
    error: postError,
  } = useQuery(["posts", router.query.blogId, router.query.postSlug], () =>
    api.posts.get(blogId, postSlug)
  );

  const deletePost = useMutation({
    mutationFn: () => api.posts.delete(blogId, postSlug),
    onSuccess: () => {
      window.location.reload();
    },
  });

  const updatePost = useMutation({
    mutationFn: (
      data: Partial<{
        title: string;
        published: boolean;
        slug: string;
        cover_image?: string;
        content?: any;
      }>
    ) => api.posts.update(blogId, postSlug, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["posts", blogId, postSlug]);
    },
  });

  if (isLoading) {
    return (
      <div className="flex-center p-12">
        <Spinner />
      </div>
    );
  }
  return (
    <div className="flex min-h-screen w-full flex-col">
      <ZendoEditor
        onSave={async (content) => {
          try {
            await updatePost.mutateAsync(content);
            toast.success("Post saved!");
          } catch (error) {
            toast.error("Failed to save post");
            console.error(error);
          }
        }}
        post={post as any} // TODO: rm any
      />
    </div>
  );
}
