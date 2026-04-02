import { handle } from "hono/vercel";
import type { NextRequest } from "next/server";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import {
  createDb,
  getPublicAuthorBySlug,
  getPublicPostBySlug,
  listPublicAuthors,
  listPublicCategories,
  listPublicPosts,
  listPublicTags,
} from "@zenblog/db";
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
  const db = createDb();

  if (!isValidBlogId(rawBlogId)) {
    return throwError(c, "MISSING_BLOG_ID");
  }

  const blogId: string = rawBlogId;

  const postsResult = await listPublicPosts(db, {
    blogId,
    offset,
    limit,
    category: categoryFilter,
    tags: tagsFilter,
    author: authorFilter,
  });

  if (!postsResult.data.length) {
    return throwError(c, "NO_POSTS_FOUND");
  }

  const res: PublicApiResponse<Post[]> = {
    data: postsResult.data as Post[],
    total: postsResult.total,
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
  const db = createDb();

  if (!isValidBlogId(rawBlogId) || !slug?.trim()) {
    return throwError(c, "MISSING_BLOG_ID_OR_SLUG");
  }

  const blogId: string = rawBlogId;

  const post = await getPublicPostBySlug(db, { blogId, slug });

  if (!post) {
    return throwError(c, "NO_POSTS_FOUND");
  }

  return c.json({ data: post as PostWithContent }, 200);
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
  const db = createDb();

  if (!isValidBlogId(rawBlogId)) {
    return throwError(c, "MISSING_BLOG_ID");
  }

  const blogId: string = rawBlogId;

  const categoriesResult = await listPublicCategories(db, {
    blogId,
    offset,
    limit,
  });

  if (!categoriesResult.data.length) {
    return throwError(c, "NO_CATEGORIES_FOUND");
  }

  const res: PublicApiResponse<typeof categoriesResult.data> = {
    data: categoriesResult.data,
    total: categoriesResult.total,
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
  const db = createDb();

  if (!isValidBlogId(rawBlogId)) {
    return throwError(c, "MISSING_BLOG_ID");
  }

  const blogId: string = rawBlogId;

  const tagsResult = await listPublicTags(db, {
    blogId,
    offset,
    limit,
  });

  if (!tagsResult.data.length) {
    return throwError(c, "NO_TAGS_FOUND");
  }

  const res: PublicApiResponse<typeof tagsResult.data> = {
    data: tagsResult.data,
    total: tagsResult.total,
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
  const db = createDb();

  if (!isValidBlogId(rawBlogId)) {
    return throwError(c, "MISSING_BLOG_ID");
  }

  const blogId: string = rawBlogId;

  const authorsResult = await listPublicAuthors(db, {
    blogId,
    offset,
    limit,
  });

  if (!authorsResult.data.length) {
    return throwError(c, "NO_AUTHORS_FOUND");
  }

  const res: PublicApiResponse<typeof authorsResult.data> = {
    data: authorsResult.data,
    total: authorsResult.total,
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
  const db = createDb();

  if (!isValidBlogId(rawBlogId) || !slug?.trim()) {
    return throwError(c, "MISSING_BLOG_ID_OR_SLUG");
  }

  const blogId: string = rawBlogId;

  const author = await getPublicAuthorBySlug(db, { blogId, slug });

  if (!author) {
    return throwError(c, "AUTHOR_NOT_FOUND");
  }

  return c.json({
    data: author,
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

class NextFetchEventLike {
  constructor(readonly request: Request) {}
  respondWith(_promise: Response | Promise<Response>) {}
  passThroughOnException() {}
  waitUntil(_promise: Promise<void>) {}
}

const honoHandler = handle(app);

const routeHandler = (request: NextRequest) =>
  honoHandler(request, new NextFetchEventLike(request) as any);

export const GET = routeHandler;
export const POST = routeHandler;
export const PUT = routeHandler;
export const PATCH = routeHandler;
export const DELETE = routeHandler;
