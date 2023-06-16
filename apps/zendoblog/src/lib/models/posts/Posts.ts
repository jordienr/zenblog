import { Database } from "@/types/supabase";
import { z } from "zod";

export type Post = Database["public"]["Tables"]["posts"]["Row"];

export const getPostsRes = z.object({
  blog: z.object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
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
      })
    )
    .optional(),
});

export type getPostsRes = z.infer<typeof getPostsRes>;
