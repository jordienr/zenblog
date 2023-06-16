import { Database } from "@/types/supabase";
import { z } from "zod";

export type DBAPIKey = Database["public"]["Tables"]["api_keys"]["Row"];

export const APIKey = z.object({
  id: z.string(),
  key: z.string(),
  blog_id: z.string(),
  user_id: z.string(),
  created_at: z.string(),
  name: z.string(),
});

export type APIKey = z.infer<typeof APIKey>;

export const getAPIKeysRes = z.array(APIKey).optional();

export type getAPIKeysRes = z.infer<typeof getAPIKeysRes>;

export const postAPIKeysRes = z.array(APIKey);

export type postAPIKeysRes = z.infer<typeof postAPIKeysRes>;

export const deleteAPIKeysRes = z.object({
  success: z.boolean(),
});

export type deleteAPIKeysRes = z.infer<typeof deleteAPIKeysRes>;
