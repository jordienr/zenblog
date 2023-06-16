// Next API Function GET all blogs

import { getAuthedDB } from "@/lib/server/handler";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = await getAuthedDB(req, res);
  if (!db) return res.status(401).json({ error: "Unauthorized" });

  const { data: blogs, error } = await db.from("blogs").select("*");

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json(blogs);
}
