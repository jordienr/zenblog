import { handle } from "hono/vercel";
import { createClient } from "@/lib/server/supabase";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { Hono } from "hono";
import { categories, postBySlug, posts, tags } from "./public-api.constants";
import { PublicApiResponse } from "./public-api.types";
import { Post } from "@zenblog/types";
import { throwError } from "./public-api.errors";
import { trackApiUsage } from "lib/axiom";

const app = new Hono()
  .basePath("/api/public")
  .use("*", logger())
  .use("*", prettyJSON())
  .use("*", async (ctx, next) => {
    // middleware doesnt get the blogId param
    // so we need to get it from the url
    const blogId = ctx.req.url.split("/")[6];

    if (!blogId) {
      await next();
      return;
    }

    trackApiUsage({
      blogId,
      event: "api-usage",
      timestamp: new Date().toISOString(),
      path: ctx.req.url,
    });

    await next();
  });

app.get(posts.path, async (c) => {
  const blogId = c.req.param("blogId");
  const offset = parseInt(c.req.query("offset") || "0");
  const limit = parseInt(c.req.query("limit") || "30");
  const supabase = createClient();

  if (!blogId) {
    return throwError(c, "MISSING_BLOG_ID");
  }

  const { data: posts, error } = await supabase
    .from("posts_v7")
    .select("title, slug, published_at, excerpt, cover_image, tags, category")
    .eq("blog_id", blogId)
    .eq("published", true)
    .eq("deleted", false)
    .order("published_at", { ascending: false })
    .range(offset, offset + limit);

  if (error) {
    return throwError(c, "NO_POSTS_FOUND");
  }

  if (!posts) {
    return throwError(c, "NO_POSTS_FOUND");
  }

  const res: PublicApiResponse<Post[]> = {
    data: posts as unknown as Post[], // type casting since views return array of Type | null
  };

  return c.json(res, 200);
});

app.get(postBySlug.path, async (c) => {
  const blogId = c.req.param("blogId");
  const slug = c.req.param("slug");
  const supabase = createClient();

  if (!blogId || !slug) {
    return throwError(c, "MISSING_BLOG_ID_OR_SLUG");
  }

  const { data: post, error } = await supabase
    .from("posts_v7")
    .select(
      "title, slug, published_at, excerpt, cover_image, tags, category, html_content"
    )
    .eq("blog_id", blogId)
    .eq("slug", slug)
    .single();

  if (error) {
    return throwError(c, "POST_NOT_FOUND");
  }

  return c.json({ data: post });
});

app.get(categories.path, async (c) => {
  const blogId = c.req.param("blogId");
  const supabase = createClient();

  if (!blogId) {
    return throwError(c, "MISSING_BLOG_ID");
  }

  const { data: categories, error } = await supabase
    .from("categories")
    .select("name, slug")
    .eq("blog_id", blogId);

  if (error) {
    return throwError(c, "NO_CATEGORIES_FOUND");
  }

  return c.json({ data: categories });
});

app.get(tags.path, async (c) => {
  const blogId = c.req.param("blogId");
  const supabase = createClient();

  if (!blogId) {
    return throwError(c, "MISSING_BLOG_ID");
  }

  const { data: tags, error } = await supabase
    .from("tags")
    .select("name, slug")
    .eq("blog_id", blogId);

  if (error) {
    return throwError(c, "NO_TAGS_FOUND");
  }

  return c.json({ data: tags });
});

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
