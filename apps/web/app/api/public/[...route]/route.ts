import { handle } from "hono/vercel";
import { createClient } from "@/lib/server/supabase";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { Hono } from "hono";
import {
  categories,
  postBySlug,
  posts,
  tags,
  authors,
} from "./public-api.constants";
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
  const categoryFilter = c.req.query("category");
  const tagsFilter = c.req.query("tags")?.split(",");
  const authorFilter = c.req.query("author");
  const supabase = createClient();

  if (!blogId) {
    return throwError(c, "MISSING_BLOG_ID");
  }

  let postsQuery = supabase
    .from("posts_v10")
    .select(
      "title, slug, published_at, excerpt, cover_image, tags, category_name, category_slug, authors"
    )
    .eq("blog_id", blogId)
    .eq("published", true)
    .eq("deleted", false)
    .order("published_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (categoryFilter) {
    postsQuery.eq("category_slug", categoryFilter);
  }

  const blogTagsQuery = await supabase
    .from("tags")
    .select("slug, name")
    .eq("blog_id", blogId);

  if (tagsFilter && tagsFilter.length > 0) {
    // Filter posts query by tags in request
    postsQuery = postsQuery.overlaps("tags", tagsFilter);
  }

  const authorsQuery = await supabase
    .from("authors")
    .select("id, slug, name, image_url, bio, website, twitter")
    .eq("blog_id", blogId);

  if (authorFilter) {
    const authorData = authorsQuery.data?.find((a) => a.slug === authorFilter);

    postsQuery = postsQuery.overlaps("authors", [authorData?.id]);
  }

  const { data: posts, error } = await postsQuery;

  if (error) {
    console.log(error);
    return throwError(c, "NO_POSTS_FOUND");
  }

  if (!posts) {
    return throwError(c, "NO_POSTS_FOUND");
  }

  const formattedPostsRes = posts.map(
    ({ category_name, category_slug, ...post }) => {
      if (!category_name || !category_slug) {
        return { ...post, category: null };
      }

      if (!post.tags) {
        return {
          ...post,
          category: { name: category_name, slug: category_slug },
        };
      }

      if (!post.authors) {
        return {
          ...post,
          category: { name: category_name, slug: category_slug },
          tags: blogTagsQuery.data?.filter((tag) =>
            post.tags?.includes(tag.slug)
          ),
        };
      }

      return {
        ...post,
        category: { name: category_name, slug: category_slug },
        tags: blogTagsQuery.data?.filter((tag) =>
          post.tags?.includes(tag.slug)
        ),
        authors: authorsQuery.data
          ?.filter((author) => post.authors?.includes(author.id))
          .map(({ id, ...author }) => author),
      };
    }
  );

  const res: PublicApiResponse<Post[]> = {
    data: formattedPostsRes as unknown as Post[], // type casting since views return array of Type | null
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

app.get(authors.path, async (c) => {
  const blogId = c.req.param("blogId");
  const supabase = createClient();

  if (!blogId) {
    return throwError(c, "MISSING_BLOG_ID");
  }

  const { data: authors, error } = await supabase
    .from("authors")
    .select("name, slug, image_url, twitter, website, bio")
    .eq("blog_id", blogId);

  if (error) {
    return throwError(c, "NO_AUTHORS_FOUND");
  }

  return c.json({ data: authors });
});

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
