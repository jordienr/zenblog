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
import { ZendoEditor } from "@/components/Editor/ZendoEditor";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string(),
  slug: z.string(),
  published: z.boolean(),
});
type FormData = z.infer<typeof formSchema>;

export default function CreatePost() {
  const { handleSubmit, register, setValue } = useForm<FormData>();

  const router = useRouter();
  const blogId = router.query.blogId as string;
  const store = useAppStore();
  const supa = useSupabaseClient();

  const onSubmit = handleSubmit(async (data) => {
    store.startLoading();

    try {
      const formData = formSchema.parse(data);
      const user = await supa.auth.getUser();

      if (!user.data.user) {
        throw new Error("No user");
      }

      const payload = {
        title: formData.title,
        slug: formData.slug,
        // content: editor?.getJSON(),
        blog_id: blogId,
        user_id: user.data.user.id,
        published: formData.published,
      };

      const res = await supa.from("posts").insert(payload);

      // const jsonContent = editor?.getJSON();
      // if (!jsonContent) {
      //   throw new Error("No content");
      // }

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

  return (
    <ZendoEditor
      onSave={async (content) => {
        try {
          await supa.from("posts").insert({ ...content, blog_id: blogId });
          toast.success("Post saved!");
        } catch (error) {
          toast.error("Failed to save post");
          console.error(error);
        }
      }}
    />
  );
}
