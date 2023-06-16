import { Database } from "@/types/supabase";
import { z } from "zod";

export type BD_BLOG = Database["public"]["Tables"]["blogs"]["Row"];

const BASE_BLOG = {
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  emoji: z.string(),
  description: z.string(),
  created_at: z.string(),
};

export const Blog = z.object(BASE_BLOG);

export type Blog = z.infer<typeof Blog>;

export const GetBlogRes = z.object(BASE_BLOG);

export type GetBlogRes = z.infer<typeof Blog>;

export const PatchBlog = z.object({
  title: BASE_BLOG.title.optional(),
  slug: BASE_BLOG.slug.optional(),
  emoji: BASE_BLOG.emoji.optional(),
  description: BASE_BLOG.description.optional(),
});

export type PatchBlog = z.infer<typeof PatchBlog>;

export const DeleteBlogRes = z.object({
  success: z.boolean(),
});

export type DeleteBlogRes = z.infer<typeof DeleteBlogRes>;
