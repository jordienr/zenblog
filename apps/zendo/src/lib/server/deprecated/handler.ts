import { getSupabaseBrowserClient } from "@/lib/supabase";
import { NextApiRequest, NextApiResponse } from "next";

export async function getApiClientDB(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const key = req.headers["znd-api-key"];

  const db = getSupabaseBrowserClient();

  const { data, error } = await db
    .from("api_keys")
    .select("*")
    .eq("key", key)
    .single();

  if (error) {
    throw error;
  }
  return { db, data };
}
