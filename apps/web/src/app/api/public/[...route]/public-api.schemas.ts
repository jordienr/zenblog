import { z } from "@hono/zod-openapi";

// Base entity schemas
export const TagSchema = z
  .object({
    name: z.string().openapi({ example: "Technology" }),
    slug: z.string().openapi({ example: "technology" }),
  })
  .openapi("Tag");

export const CategorySchema = z
  .object({
    name: z.string().openapi({ example: "News" }),
    slug: z.string().openapi({ example: "news" }),
  })
  .openapi("Category");

export const PostAuthorSchema = z
  .object({
    name: z.string().openapi({ example: "John Doe" }),
    slug: z.string().openapi({ example: "john-doe" }),
    image_url: z.string().openapi({ example: "https://example.com/avatar.jpg" }),
    bio: z.string().optional().openapi({ example: "Software engineer and writer" }),
    twitter_url: z.string().optional().openapi({ example: "https://twitter.com/johndoe" }),
    website_url: z.string().optional().openapi({ example: "https://johndoe.com" }),
  })
  .openapi("PostAuthor");

export const AuthorSchema = z
  .object({
    name: z.string().openapi({ example: "John Doe" }),
    slug: z.string().openapi({ example: "john-doe" }),
    image_url: z.string().nullable().optional().openapi({ example: "https://example.com/avatar.jpg" }),
    bio: z.string().nullable().optional().openapi({ example: "Software engineer and writer" }),
    twitter: z.string().nullable().optional().openapi({
      example: "https://twitter.com/johndoe",
      deprecated: true,
      description: "Deprecated. Use twitter_url.",
    }),
    website: z.string().nullable().optional().openapi({
      example: "https://johndoe.com",
      deprecated: true,
      description: "Deprecated. Use website_url.",
    }),
    twitter_url: z.string().optional().openapi({ example: "https://twitter.com/johndoe" }),
    website_url: z.string().optional().openapi({ example: "https://johndoe.com" }),
  })
  .openapi("Author");

export const PostSchema = z
  .object({
    title: z.string().openapi({ example: "My First Blog Post" }),
    slug: z.string().openapi({ example: "my-first-blog-post" }),
    published_at: z.string().openapi({ example: "2024-01-15T10:30:00Z" }),
    excerpt: z.string().optional().openapi({ example: "A brief introduction to the post..." }),
    cover_image: z.string().optional().openapi({ example: "https://example.com/cover.jpg" }),
    tags: z.array(TagSchema),
    category: CategorySchema.nullable(),
    authors: z.array(PostAuthorSchema),
  })
  .openapi("Post");

export const PostWithContentSchema = PostSchema.extend({
  html_content: z.string().openapi({ example: "<h1>Hello World</h1><p>This is my first post.</p>" }),
}).openapi("PostWithContent");

// Query parameter schemas
export const PaginationQuerySchema = z.object({
  offset: z.string().optional().openapi({
    param: { name: "offset", in: "query" },
    example: "0",
    description: "The offset for pagination"
  }),
  limit: z.string().optional().openapi({
    param: { name: "limit", in: "query" },
    example: "30",
    description: "The limit for pagination"
  }),
});

export const PostsQuerySchema = PaginationQuerySchema.extend({
  category: z.string().optional().openapi({
    param: { name: "category", in: "query" },
    example: "news",
    description: "Filter posts by category slug"
  }),
  tags: z.string().optional().openapi({
    param: { name: "tags", in: "query" },
    example: "tag1,tag2",
    description: "Comma-separated list of tag slugs to filter by"
  }),
  author: z.string().optional().openapi({
    param: { name: "author", in: "query" },
    example: "john-doe",
    description: "Filter posts by author slug"
  }),
});

// Path parameter schemas
export const BlogIdParamSchema = z.object({
  blogId: z.string().openapi({
    param: { name: "blogId", in: "path" },
    example: "53a970ef-cc74-40ac-ac53-c322cd4848cb",
    description: "The unique identifier for the blog"
  }),
});

export const SlugParamSchema = z.object({
  slug: z.string().openapi({
    param: { name: "slug", in: "path" },
    example: "my-first-post",
    description: "The slug identifier"
  }),
});

// Response schemas
export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: z.array(dataSchema),
    total: z.number().optional().openapi({ example: 100 }),
    offset: z.number().optional().openapi({ example: 0 }),
    limit: z.number().optional().openapi({ example: 30 }),
  });

export const PostsResponseSchema = PaginatedResponseSchema(PostSchema).openapi("PostsResponse");

export const CategoriesResponseSchema = PaginatedResponseSchema(CategorySchema).openapi("CategoriesResponse");

export const TagsResponseSchema = PaginatedResponseSchema(TagSchema).openapi("TagsResponse");

export const AuthorsResponseSchema = PaginatedResponseSchema(AuthorSchema).openapi("AuthorsResponse");

export const PostBySlugResponseSchema = z
  .object({
    data: PostWithContentSchema,
  })
  .openapi("PostBySlugResponse");

export const AuthorBySlugResponseSchema = z
  .object({
    data: AuthorSchema,
  })
  .openapi("AuthorBySlugResponse");

// Error schema
export const ErrorResponseSchema = z
  .object({
    message: z.string().openapi({ example: "No posts found" }),
  })
  .openapi("ErrorResponse");
