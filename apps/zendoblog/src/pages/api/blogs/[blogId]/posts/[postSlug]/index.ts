// Next API Function GET all blogs

import { getAuthAndDB } from "@/lib/server/handler";
import { NextApiRequest, NextApiResponse } from "next";
import { PatchPost } from "@/lib/models/posts/Posts";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { db, auth } = await getAuthAndDB(req, res);
  const blogId = req.query.blogId as string;
  const postSlug = req.query.postSlug as string;

  if (req.method === "PATCH") {
    const data = PatchPost.safeParse(JSON.parse(req.body));

    if (!data.success) {
      return res.status(400).json({ error: data.error.message });
    }

    const { title, slug, content, published } = data.data;

    const updated_at = new Date().toISOString();

    const { data: post, error } = await db
      .from("posts")
      .update({ title, content, slug, published, updated_at })
      .eq("blog_id", blogId)
      .eq("user_id", auth.userId)
      .eq("slug", postSlug)
      .select()
      .single();

    if (error) {
      console.error(error.message);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true });
  } else if (req.method === "GET") {
    const { data: post, error } = await db
      .from("posts")
      .select("*")
      .eq("slug", postSlug)
      .eq("blog_id", blogId)
      .eq("user_id", auth.userId)
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(post);
  } else if (req.method === "DELETE") {
    const { data: post, error } = await db
      .from("posts")
      .delete()
      .eq("blog_id", blogId)
      .eq("user_id", auth.userId)
      .eq("slug", postSlug)
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true });
  }
}
