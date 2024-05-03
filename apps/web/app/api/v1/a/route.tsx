import { getPostViews } from "@/analytics";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const blog_id = searchParams.get("blog_id");

  if (!blog_id) {
    return new Response("Missing blog_id or post_slug", {
      status: 400,
    });
  }

  const res = await getPostViews({
    blog_id,
  });

  return new Response(JSON.stringify(res), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
