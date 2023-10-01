import { getServerClient } from "@/lib/server/supabase";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { db, user } = await getServerClient(req, res);

  if (!db || !user) {
    console.log("No user or db", { db, user });
    return res.status(401).json({ error: "Unauthorized 1" });
  }

  const { data: blogs, error } = await db.from("blogs").select("*");

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json(blogs);
}
