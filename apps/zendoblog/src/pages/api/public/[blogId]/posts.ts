import { getClientClient } from "@/lib/supabase";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log("🪵 req.query.blogId", req.query.blogId);
    const db = getClientClient();
    const blogId = req.query.blogId as string;
    const { data, error } = await db
      .from("posts")
      .select("*")
      .eq("blog_id", blogId);
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "ERROR TRYING TO RETURN POSTS" });
    }
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "ERROR TRYING TO RETURN POSTS" });
  }
}
