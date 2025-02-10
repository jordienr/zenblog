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
  authorBySlug,
} from "./public-api.constants";
import { PublicApiResponse } from "./public-api.types";
import { Post, PostWithContent } from "@zenblog/types";
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
      "title, slug, published_at, excerpt, cover_image, tags, category_name, category_slug, authors",
      { count: "exact" }
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

  const { data: posts, error, count } = await postsQuery;

  if (error) {
    console.log(error);
    return throwError(c, "NO_POSTS_FOUND");
  }

  if (!posts) {
    return throwError(c, "NO_POSTS_FOUND");
  }

  const formattedPostsRes = posts.map(
    ({ category_name, category_slug, ...post }) => {
      const basePost = {
        ...post,
        category:
          category_name && category_slug
            ? { name: category_name, slug: category_slug }
            : null,
        tags: post.tags
          ? blogTagsQuery.data?.filter((tag) => post.tags?.includes(tag.slug))
          : [],
        authors:
          post.authors && authorsQuery.data
            ? authorsQuery.data
                .filter((author) => post.authors?.includes(author.id))
                .map(({ id, ...author }) => ({
                  ...author,
                  image_url: author.image_url || "",
                  bio: author.bio || undefined,
                  website_url: author.website || undefined,
                  twitter_url: author.twitter || undefined,
                }))
            : [],
      };

      return basePost;
    }
  );

  const res: PublicApiResponse<Post[]> = {
    data: formattedPostsRes as unknown as Post[],
    total: count || 0,
    offset,
    limit,
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
    .from("posts_v10")
    .select(
      "title, slug, published_at, excerpt, cover_image, tags, category_name, category_slug, html_content, authors"
    )
    .eq("blog_id", blogId)
    .eq("slug", slug)
    .single();

  if (error || !post) {
    return throwError(c, "NO_POSTS_FOUND");
  }

  // Fetch tags data
  const { data: tagsData } = await supabase
    .from("tags")
    .select("slug, name")
    .eq("blog_id", blogId)
    .in("slug", post.tags || []);

  // Create initial formatted post with correct tags
  let formattedPost: PostWithContent = {
    title: post.title || "",
    slug: post.slug || "",
    published_at: post.published_at || "",
    excerpt: post.excerpt || "",
    cover_image: post.cover_image || "",
    tags: tagsData || [],
    category:
      !post.category_name || !post.category_slug
        ? null
        : {
            name: post.category_name,
            slug: post.category_slug,
          },
    authors: [],
    html_content: post.html_content || "",
  };

  if (post.authors && post.authors.length > 0) {
    const { data: authorsData } = await supabase
      .from("authors")
      .select("id, slug, name, image_url, bio, website, twitter")
      .eq("blog_id", blogId)
      .in("id", post.authors);
    if (authorsData) {
      formattedPost = {
        ...formattedPost, // Spread the existing formattedPost to keep the correct tags
        authors: authorsData.map(({ id, ...author }) => ({
          ...author,
          image_url: author.image_url || "",
          bio: author.bio || undefined,
          website_url: author.website || undefined,
          twitter_url: author.twitter || undefined,
        })),
      };
    }
  }

  return c.json({ data: formattedPost });
});

app.get(categories.path, async (c) => {
  const blogId = c.req.param("blogId");
  const offset = parseInt(c.req.query("offset") || "0");
  const limit = parseInt(c.req.query("limit") || "30");
  const supabase = createClient();

  if (!blogId) {
    return throwError(c, "MISSING_BLOG_ID");
  }

  const {
    data: categories,
    error,
    count,
  } = await supabase
    .from("categories")
    .select("name, slug", { count: "exact" })
    .eq("blog_id", blogId)
    .range(offset, offset + limit - 1);

  if (error) {
    return throwError(c, "NO_CATEGORIES_FOUND");
  }

  const res: PublicApiResponse<typeof categories> = {
    data: categories,
    total: count || 0,
    offset,
    limit,
  };

  return c.json(res);
});

app.get(tags.path, async (c) => {
  const blogId = c.req.param("blogId");
  const offset = parseInt(c.req.query("offset") || "0");
  const limit = parseInt(c.req.query("limit") || "30");
  const supabase = createClient();

  if (!blogId) {
    return throwError(c, "MISSING_BLOG_ID");
  }

  const {
    data: tags,
    error,
    count,
  } = await supabase
    .from("tags")
    .select("name, slug", { count: "exact" })
    .eq("blog_id", blogId)
    .range(offset, offset + limit - 1);

  if (error) {
    return throwError(c, "NO_TAGS_FOUND");
  }

  const res: PublicApiResponse<typeof tags> = {
    data: tags,
    total: count || 0,
    offset,
    limit,
  };

  return c.json(res);
});

app.get(authors.path, async (c) => {
  const blogId = c.req.param("blogId");
  const offset = parseInt(c.req.query("offset") || "0");
  const limit = parseInt(c.req.query("limit") || "30");
  const supabase = createClient();

  if (!blogId) {
    return throwError(c, "MISSING_BLOG_ID");
  }

  const {
    data: authors,
    error,
    count,
  } = await supabase
    .from("authors")
    .select("name, slug, image_url, twitter, website, bio", { count: "exact" })
    .eq("blog_id", blogId)
    .range(offset, offset + limit - 1);

  if (error) {
    return throwError(c, "NO_AUTHORS_FOUND");
  }

  const res: PublicApiResponse<typeof authors> = {
    data: authors,
    total: count || 0,
    offset,
    limit,
  };

  return c.json(res);
});

app.get(authorBySlug.path, async (c) => {
  const blogId = c.req.param("blogId");
  const slug = c.req.param("slug");
  const supabase = createClient();

  if (!blogId || !slug) {
    return throwError(c, "MISSING_BLOG_ID_OR_SLUG");
  }

  const { data: author, error } = await supabase
    .from("authors")
    .select("name, slug, image_url, twitter, website, bio")
    .eq("blog_id", blogId)
    .eq("slug", slug)
    .single();

  if (error || !author) {
    return throwError(c, "AUTHOR_NOT_FOUND");
  }

  return c.json({
    data: {
      ...author,
      image_url: author.image_url || "",
      bio: author.bio || "",
      website: author.website || "",
      twitter: author.twitter || "",
    },
  });
});

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
