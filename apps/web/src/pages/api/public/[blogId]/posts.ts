import { NextApiRequest, NextApiResponse } from "next";
import { createAdminClient } from "@/lib/server/supabase/admin";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const db = createAdminClient();
    const blogId = req.query.blogId || "";
    const withContent = req.query.withContent || false;

    if (!blogId) {
      return res.status(400).json({ error: "NO BLOG ID PROVIDED" });
    }

    const { data, error } = await db
      .from("posts_v5")
      .select(
        `title, ${
          withContent ? "content, " : ""
        } cover_image, metadata,updated_at,slug,tags,published_at`
      )
      .eq("blog_id", blogId)
      .eq("published", true)
      .eq("deleted", false)
      .eq("subscription_status", "active")
      .order("published_at", { ascending: false });

    if (error) {
      console.error(error);
      return res.status(500).json({ error: "ERROR FETCHING BLOG" });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "ERROR TRYING TO RETURN POSTS" });
  }
}
