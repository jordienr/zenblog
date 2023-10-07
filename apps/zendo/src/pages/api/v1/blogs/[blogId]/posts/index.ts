// Next API Function GET all blogs

import { getPostsRes } from "@/lib/models/posts/Posts";
import { getServerClient } from "@/lib/server/supabase";
// import { getAuth } from "@clerk/nextjs/server";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

// What we get from the database
const dbResSchema = z.array(
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
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { db } = await getServerClient(req, res);
  // const { userId } = getAuth(req);
  const blogId = req.query.blogId;

  if (!db) return res.status(401).json({ error: "Unauthorized" });

  const getBlog = () => db.from("blogs").select("*").eq("id", blogId).single();
  const getPosts = () =>
    db
      .from("posts")
      .select(
        `
    id,
    title,
    slug,
    published,
    created_at,
    updated_at,
    blog_id,
    user_id,
    cover_image
  `
      )
      .eq("blog_id", blogId);

  const [blogRes, postsRes] = await Promise.all([getBlog(), getPosts()]);

  if (!blogRes.data) {
    return res.status(404).json({ error: "Blog not found" });
  }

  const blog = blogRes.data;
  const posts = postsRes.data;

  const jsonRes: getPostsRes = {
    blog,
    posts: posts || [],
  };

  const apiRes = getPostsRes.safeParse(jsonRes);

  if (!apiRes.success) {
    return res.status(500).json({ error: "Error parsing API Response" });
  }

  return res.status(200).json(apiRes.data);
}
