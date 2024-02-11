import { NextApiRequest, NextApiResponse } from "next";
import { getClientClient } from "../../supabase";

export async function getApiClientDB(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const key = req.headers["znd-api-key"];

  const db = getClientClient();

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
