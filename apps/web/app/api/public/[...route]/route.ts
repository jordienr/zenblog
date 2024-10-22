import { handle } from "hono/vercel";
import { createClient } from "@/lib/server/supabase";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { Hono } from "hono";
import bcrypt from "bcrypt";
import { categories, postBySlug, posts, tags } from "./public-api.constants";

async function verifyAPIKey(header: string, blogId: string) {
  const supabase = createClient();
  const unhashedKey = header.split(" ")[1];

  if (!unhashedKey) {
    return false;
  }

  const { data, error } = await supabase
    .from("blogs")
    .select("access_token")
    .eq("id", blogId)
    .single();

  if (error) {
    console.log("🔴 Error getting blog id from token:", error);
    return false;
  }

  if (!data?.access_token) {
    return false;
  }

  const isValid = await bcrypt.compare(unhashedKey, data?.access_token);
  return isValid;
}

export const app = new Hono()
  .basePath("/api/public")
  .use("*", logger())
  .use("*", prettyJSON());

app.get(posts.path, async (c) => {
  const blogId = c.req.param("blogId");
  const offset = parseInt(c.req.query("offset") || "0");
  const limit = parseInt(c.req.query("limit") || "30");
  const supabase = createClient();
  const authHeader = c.req.header("Authorization");

  if (!blogId) {
    return c.json({ message: "No blogId provided" }, 400);
  }

  if (!authHeader) {
    return c.json({ message: "No authorization header" }, 401);
  }

  const isValid = await verifyAPIKey(authHeader, blogId);

  if (!isValid) {
    return c.json({ message: "Invalid API key" }, 401);
  }

  const rpcRes = await supabase.rpc("get_posts_by_blog", {
    p_blog_id: blogId,
    p_limit: limit || 30,
    p_offset: offset || 0,
  });

  console.log(rpcRes);

  if (rpcRes.error) {
    console.log("🔴 Error getting posts:", rpcRes.error);
    return c.json({ message: "No posts found" }, 404);
  }

  const res = {
    // @ts-ignore
    posts: rpcRes.data?.posts,
    // @ts-ignore
    total: rpcRes.data?.total,
    offset,
    limit,
  };

  console.log(res);

  return c.json(res, 200);
});

app.get(postBySlug.path, async (c) => {
  const blogId = c.req.param("blogId");
  const slug = c.req.param("slug");
  const supabase = createClient();
  const authHeader = c.req.header("Authorization");

  if (!blogId || !slug) {
    return c.json({ message: "No blogId or slug provided" }, 400);
  }

  if (!authHeader) {
    return c.json({ message: "No authorization header" }, 401);
  }

  const isValid = await verifyAPIKey(authHeader, blogId);

  if (!isValid) {
    return c.json({ message: "Invalid API key" }, 401);
  }

  const { data: post, error } = await supabase.rpc("get_blog_post", {
    p_blog_id: blogId,
    p_slug: slug,
  });

  if (error) {
    console.log("🔴 Error getting post:", error);
    return c.json({ message: "Post not found" }, 404);
  }

  return c.json(post);
});

app.get(categories.path, async (c) => {
  const blogId = c.req.param("blogId");
  const supabase = createClient();
  const authHeader = c.req.header("Authorization");

  if (!blogId) {
    return c.json({ message: "No blogId provided" }, 400);
  }

  if (!authHeader) {
    return c.json({ message: "No authorization header" }, 401);
  }

  const isValid = await verifyAPIKey(authHeader, blogId);

  if (!isValid) {
    return c.json({ message: "Invalid API key" }, 401);
  }

  const { data: categories, error } = await supabase
    .from("categories")
    .select("name, slug")
    .eq("blog_id", blogId);

  if (error) {
    console.log("🔴 Error getting categories:", error);
    return c.json({ message: "No categories found" }, 404);
  }

  return c.json(categories);
});

app.get(tags.path, async (c) => {
  const blogId = c.req.param("blogId");
  const supabase = createClient();
  const authHeader = c.req.header("Authorization");

  if (!blogId) {
    return c.json({ message: "No blogId provided" }, 400);
  }

  if (!authHeader) {
    return c.json({ message: "No authorization header" }, 401);
  }

  const isValid = await verifyAPIKey(authHeader, blogId);

  if (!isValid) {
    return c.json({ message: "Invalid API key" }, 401);
  }

  const { data: tags, error } = await supabase
    .from("blog_tags")
    .select("name, slug")
    .eq("blog_id", blogId);

  if (error) {
    console.log("🔴 Error getting tags:", error);
    return c.json({ message: "No tags found" }, 404);
  }

  return c.json(tags);
});

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
