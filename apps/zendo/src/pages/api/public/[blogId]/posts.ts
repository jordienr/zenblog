import { createAdminClient } from "@/lib/server/supabase";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const db = createAdminClient();
    const blogId = req.query.blogId || "";

    const blogPromise = db
      .from("blogs")
      .select("user_id")
      .eq("id", blogId)
      .single();

    const postsPromise = db
      .from("posts")
      .select("slug, title, cover_image, created_at, updated_at")
      .eq("blog_id", blogId)
      .eq("published", true);

    const [blogResult, postsResult] = await Promise.all([
      blogPromise,
      postsPromise,
    ]);

    const { data: blog, error: blogError } = blogResult;
    const { data: posts, error: postsError } = postsResult;

    if (blogError) {
      console.error(blogError);
      return res.status(500).json({ error: "ERROR FETCHING BLOG", blogError });
    }
    if (postsError) {
      console.error(postsError);
      return res
        .status(500)
        .json({ error: "ERROR FETCHING POSTS", postsError });
    }

    const ownerId = blog?.user_id;

    if (!ownerId) {
      return res.status(500).json({ error: "OWNER ID NOT FOUND" });
    }

    const { data: subscription, error: subscriptionError } = await db
      .from("subscriptions")
      .select("status")
      .eq("user_id", ownerId)
      .single();

    if (subscriptionError) {
      console.error(subscriptionError);
      return res
        .status(500)
        .json({ error: "ERROR FETCHING SUBSCRIPTION", subscriptionError });
    }

    if (subscription?.status !== "active") {
      // If the subscription is not active, return no posts
      res.setHeader("Cache-Control", "s-maxage=1, stale-while-revalidate");
      res.setHeader("zenblog-subscription-status", "inactive");
      return res.status(200).json([]);
    }

    return res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "ERROR TRYING TO RETURN POSTS" });
  }
}
