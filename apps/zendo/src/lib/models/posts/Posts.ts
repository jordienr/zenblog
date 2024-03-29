import { Database } from "@/types/supabase";
import { z } from "zod";

export type DBPost = Database["public"]["Tables"]["posts"]["Row"];

export const getPostBySlugRes = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  content: z.any(),
  published: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
  blog_id: z.string(),
  user_id: z.string(),
  cover_image: z.string().optional(),
  metadata: z.any().optional(),
});

export const getPostsRes = z.object({
  blog: z.object({
    id: z.string(),
    title: z.string(),
    emoji: z.string(),
  }),
  posts: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        slug: z.string(),
        published: z.boolean(),
        created_at: z.string(),
        updated_at: z.string(),
        blog_id: z.string(),
        user_id: z.string(),
        cover_image: z.string().nullable(),
      })
    )
    .optional(),
});

export type getPostsRes = z.infer<typeof getPostsRes>;

export const PatchPost = z.object({
  title: z.string(),
  slug: z.string(),
  content: z.any(),
  cover_image: z.string().nullable(),
  published: z.boolean(),
  metadata: z.any().nullable(),
});
