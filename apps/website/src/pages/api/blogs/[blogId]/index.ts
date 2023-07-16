// Next API Function GET all blogs

import { getAuthAndDB } from "@/lib/server/handler";
import { NextApiRequest, NextApiResponse } from "next";
import { PatchBlog } from "@/lib/models/blogs/Blogs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { db, auth } = await getAuthAndDB(req, res);
  const blogId = req.query.blogId as string;

  if (req.method === "PATCH") {
    console.log("req.body", req.body);
    const data = PatchBlog.safeParse(JSON.parse(req.body));

    if (!data.success) {
      return res.status(400).json({ error: data.error.message });
    }

    const { title, emoji, description } = data.data;

    const { data: blog, error } = await db
      .from("blogs")
      .update({ title, emoji, description })
      .eq("id", blogId)
      .eq("user_id", auth.userId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(blog);
  } else if (req.method === "GET") {
    const { data: blogs, error } = await db
      .from("blogs")
      .select("*")
      .eq("id", blogId)
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(blogs);
  } else if (req.method === "DELETE") {
    const { data: blogs, error } = await db
      .from("blogs")
      .delete()
      .eq("id", blogId)
      .eq("user_id", auth.userId)
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true });
  }
}
