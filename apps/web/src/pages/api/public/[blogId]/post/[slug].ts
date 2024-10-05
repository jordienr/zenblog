import { sendViewEvent } from "@/analytics";
import { createAdminClient } from "@/lib/server/supabase/admin";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const db = createAdminClient();
    const blogId = req.query.blogId as string;
    const slug = req.query.slug as string;

    const blogPromise = db
      .from("blogs")
      .select("user_id")
      .eq("id", blogId)
      .single();

    const postPromise = db
      .from("posts")
      .select(
        "id, slug, title, content, cover_image, published_at, created_at, updated_at, metadata"
      )
      .eq("blog_id", blogId)
      .eq("published", true)
      .eq("slug", slug)
      .single();

    const [blogResult, postResult] = await Promise.all([
      blogPromise,
      postPromise,
    ]);

    const { data: blog } = blogResult;
    const { data: post, error } = postResult;

    const ownerId = blog?.user_id;

    if (!ownerId) {
      return res.status(500).json({ error: "ERROR TRYING TO RETURN POSTS" });
    }

    const { data: subscription } = await db
      .from("subscriptions")
      .select("status")
      .eq("user_id", ownerId)
      .single();

    sendViewEvent({
      blog_id: blogId,
      post_slug: post?.slug || "",
    });

    if (subscription?.status !== "active") {
      return res.status(401).json({ error: "UNAUTHORIZED" });
    }

    if (error) {
      return res.status(500).json({ error: "ERROR TRYING TO RETURN POSTS" });
    }
    return res.status(200).json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "ERROR TRYING TO RETURN POSTS" });
  }
}
