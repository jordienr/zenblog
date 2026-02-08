import { handle } from "hono/vercel";
import { createClient } from "@/lib/server/supabase";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
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
import { isValidBlogId } from "./public-api.validation";
import {
  PostsQuerySchema,
  PaginationQuerySchema,
  BlogIdParamSchema,
  SlugParamSchema,
  PostsResponseSchema,
  PostBySlugResponseSchema,
  CategoriesResponseSchema,
  TagsResponseSchema,
  AuthorsResponseSchema,
  AuthorBySlugResponseSchema,
  ErrorResponseSchema,
} from "./public-api.schemas";

const app = new OpenAPIHono().basePath("/api/public");

app.use("*", logger());
app.use("*", prettyJSON());
app.use("*", async (ctx, next) => {
  // middleware doesnt get the blogId param
  // so we need to get it from the url
  const rawBlogId = ctx.req.url.split("/")[6];

  if (isValidBlogId(rawBlogId)) {
    const blogId: string = rawBlogId;
    trackApiUsage({
      blogId,
      event: "api-usage",
      timestamp: new Date().toISOString(),
      path: ctx.req.url,
    });
  }

  await next();
});

// Define route: Get posts
const getPostsRoute = createRoute({
  method: "get",
  path: "/blogs/{blogId}/posts",
  request: {
    params: BlogIdParamSchema,
    query: PostsQuerySchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: PostsResponseSchema,
        },
      },
      description: "List of posts for the blog",
    },
    400: {
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
      description: "Invalid blogId provided",
    },
    404: {
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
      description: "No posts found",
    },
  },
  tags: ["Posts"],
  summary: "List posts",
  description: "Get a paginated list of published posts for a blog. Supports filtering by category, tags, and author.",
});

app.openapi(getPostsRoute, async (c) => {
  const rawBlogId = c.req.param("blogId");
  const offset = parseInt(c.req.query("offset") || "0");
  const limit = parseInt(c.req.query("limit") || "30");
  const categoryFilter = c.req.query("category");
  const tagsFilter = c.req.query("tags")?.split(",");
  const authorFilter = c.req.query("author");
  const supabase = createClient();

  if (!isValidBlogId(rawBlogId)) {
    return throwError(c, "MISSING_BLOG_ID");
  }

  const blogId: string = rawBlogId;

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

// Define route: Get post by slug
const getPostBySlugRoute = createRoute({
  method: "get",
  path: "/blogs/{blogId}/posts/{slug}",
  request: {
    params: BlogIdParamSchema.merge(SlugParamSchema),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: PostBySlugResponseSchema,
        },
      },
      description: "Post details with HTML content",
    },
    400: {
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
      description: "Missing blogId or slug",
    },
    404: {
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
      description: "Post not found",
    },
  },
  tags: ["Posts"],
  summary: "Get post by slug",
  description: "Get a single post by its slug identifier, including full HTML content.",
});

app.openapi(getPostBySlugRoute, async (c) => {
  const rawBlogId = c.req.param("blogId");
  const slug = c.req.param("slug");
  const supabase = createClient();

  if (!isValidBlogId(rawBlogId) || !slug?.trim()) {
    return throwError(c, "MISSING_BLOG_ID_OR_SLUG");
  }

  const blogId: string = rawBlogId;

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

  return c.json({ data: formattedPost }, 200);
});

// Define route: Get categories
const getCategoriesRoute = createRoute({
  method: "get",
  path: "/blogs/{blogId}/categories",
  request: {
    params: BlogIdParamSchema,
    query: PaginationQuerySchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: CategoriesResponseSchema,
        },
      },
      description: "List of categories for the blog",
    },
    400: {
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
      description: "Invalid blogId provided",
    },
    404: {
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
      description: "No categories found",
    },
  },
  tags: ["Categories"],
  summary: "List categories",
  description: "Get a paginated list of all categories for a blog.",
});

app.openapi(getCategoriesRoute, async (c) => {
  const rawBlogId = c.req.param("blogId");
  const offset = parseInt(c.req.query("offset") || "0");
  const limit = parseInt(c.req.query("limit") || "30");
  const supabase = createClient();

  if (!isValidBlogId(rawBlogId)) {
    return throwError(c, "MISSING_BLOG_ID");
  }

  const blogId: string = rawBlogId;

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

  return c.json(res, 200);
});

// Define route: Get tags
const getTagsRoute = createRoute({
  method: "get",
  path: "/blogs/{blogId}/tags",
  request: {
    params: BlogIdParamSchema,
    query: PaginationQuerySchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: TagsResponseSchema,
        },
      },
      description: "List of tags for the blog",
    },
    400: {
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
      description: "Invalid blogId provided",
    },
    404: {
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
      description: "No tags found",
    },
  },
  tags: ["Tags"],
  summary: "List tags",
  description: "Get a paginated list of all tags for a blog.",
});

app.openapi(getTagsRoute, async (c) => {
  const rawBlogId = c.req.param("blogId");
  const offset = parseInt(c.req.query("offset") || "0");
  const limit = parseInt(c.req.query("limit") || "30");
  const supabase = createClient();

  if (!isValidBlogId(rawBlogId)) {
    return throwError(c, "MISSING_BLOG_ID");
  }

  const blogId: string = rawBlogId;

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

  return c.json(res, 200);
});

// Define route: Get authors
const getAuthorsRoute = createRoute({
  method: "get",
  path: "/blogs/{blogId}/authors",
  request: {
    params: BlogIdParamSchema,
    query: PaginationQuerySchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: AuthorsResponseSchema,
        },
      },
      description: "List of authors for the blog",
    },
    400: {
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
      description: "Invalid blogId provided",
    },
    404: {
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
      description: "No authors found",
    },
  },
  tags: ["Authors"],
  summary: "List authors",
  description: "Get a paginated list of all authors for a blog.",
});

app.openapi(getAuthorsRoute, async (c) => {
  const rawBlogId = c.req.param("blogId");
  const offset = parseInt(c.req.query("offset") || "0");
  const limit = parseInt(c.req.query("limit") || "30");
  const supabase = createClient();

  if (!isValidBlogId(rawBlogId)) {
    return throwError(c, "MISSING_BLOG_ID");
  }

  const blogId: string = rawBlogId;

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

  const formattedAuthors =
    authors?.map((author) => ({
      ...author,
      twitter_url: author.twitter || undefined,
      website_url: author.website || undefined,
    })) || [];

  const res: PublicApiResponse<typeof formattedAuthors> = {
    data: formattedAuthors,
    total: count || 0,
    offset,
    limit,
  };

  return c.json(res, 200);
});

// Define route: Get author by slug
const getAuthorBySlugRoute = createRoute({
  method: "get",
  path: "/blogs/{blogId}/authors/{slug}",
  request: {
    params: BlogIdParamSchema.merge(SlugParamSchema),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: AuthorBySlugResponseSchema,
        },
      },
      description: "Author details",
    },
    400: {
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
      description: "Missing blogId or slug",
    },
    404: {
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
      description: "Author not found",
    },
  },
  tags: ["Authors"],
  summary: "Get author by slug",
  description: "Get a single author by their slug identifier.",
});

app.openapi(getAuthorBySlugRoute, async (c) => {
  const rawBlogId = c.req.param("blogId");
  const slug = c.req.param("slug");
  const supabase = createClient();

  if (!isValidBlogId(rawBlogId) || !slug?.trim()) {
    return throwError(c, "MISSING_BLOG_ID_OR_SLUG");
  }

  const blogId: string = rawBlogId;

  const { data: author, error } = await supabase
    .from("authors")
    .select("name, slug, image_url, twitter, website, bio")
    .eq("blog_id", blogId)
    .eq("slug", slug)
    .single();

  if (error || !author) {
    return throwError(c, "AUTHOR_NOT_FOUND");
  }

  const normalizedAuthor = {
    ...author,
    image_url: author.image_url || "",
    bio: author.bio || "",
    website: author.website || "",
    twitter: author.twitter || "",
  };

  return c.json({
    data: {
      ...normalizedAuthor,
      website_url: normalizedAuthor.website,
      twitter_url: normalizedAuthor.twitter,
    },
  }, 200);
});

// OpenAPI documentation endpoint
app.doc("/openapi.json", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "Zenblog Public API",
    description: "Public API for accessing blog content from Zenblog. Use this API to fetch posts, categories, tags, and authors for your blog.",
  },
  servers: [
    {
      url: "https://zenblog.com",
      description: "Production server",
    },
    ...(process.env.NODE_ENV === "development"
      ? [
          {
            url: "http://localhost:8082",
            description: "Development server",
          },
        ]
      : []),
  ],
});

// Scalar API Reference UI
import { apiReference } from "@scalar/hono-api-reference";

app.get(
  "/docs",
  apiReference({
    theme: "purple",
    spec: {
      url: "/api/public/openapi.json",
    },
  })
);

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
