import { NextApiRequest, NextApiResponse } from "next";
import { getClient } from "../supabase";
import { getAuth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

export async function getAuthedDB(req: NextApiRequest, res: NextApiResponse) {
  const { getToken } = getAuth(req);
  const token = await getToken({ template: "supabase" });

  return getClient(token || "");
}

export async function getAuthAndDB(req: NextApiRequest, res: NextApiResponse) {
  const db = await getAuthedDB(req, res);
  const auth = getAuth(req);

  return { db, auth };
}

export async function getApiClientDB(req: NextApiRequest, res: NextApiResponse) {
  const key = req.headers["znd-api-key"];

  const db = getClient();

  const { data, error } = await db.from("api_keys").select("*").eq("key", key).single();

  if (error) { throw error; }
  return { db, data };
}