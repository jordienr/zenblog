// contract.ts

import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { extendZodWithOpenApi } from "@anatine/zod-openapi";
import { RATELIMIT_CONFIG } from "@/lib/ratelimit";

extendZodWithOpenApi(z);
const c = initContract();

const BasePostSchema = z.object({
  created_at: z.string().openapi({
    description: "The date the post was created",
    example: "2021-01-01",
  }),
  published_at: z.string().openapi({
    description: "The date the post was published",
    example: "2021-01-01",
  }),
  cover_image: z.string().optional().openapi({
    description: "The cover image of the post",
    example: "https://example.com/cover.jpg",
  }),
  abstract: z.string().optional().openapi({
    description: "The excerpt of the post",
    example: "This is my first post!",
  }),
  slug: z
    .string()
    .openapi({ description: "The id of the post", example: "hello-world" }),
  title: z
    .string()
    .openapi({ description: "The title of the post", example: "Hello World!" }),
  category_name: z.string().nullable().openapi({
    description: "The name of the category",
    example: "Tutorials",
  }),
  category_slug: z.string().nullable().openapi({
    description: "The slug of the category",
    example: "tutorials",
  }),
});

const GetPostsSchema = BasePostSchema;

const GetPostBySlugSchema = BasePostSchema.extend({
  html_content: z.string().openapi({
    description: "The body of the post",
    example: "<p>This is my first post!</p>",
  }),
});

export type GetPostsSchema = z.infer<typeof GetPostsSchema>;
export type GetPostBySlugSchema = z.infer<typeof GetPostBySlugSchema>;

export const contract = c.router(
  {
    posts: c.router({
      get: {
        method: "GET",
        summary: "Get all posts",
        description: "Fetch all posts from your blog",
        query: z.object({
          limit: z.number().optional().openapi({
            description: "The number of posts to fetch",
            example: 10,
          }),
          offset: z.number().optional().openapi({
            description: "The number of posts to skip",
            example: 0,
          }),
        }),
        path: `/posts`,
        responses: {
          200: z.array(GetPostsSchema),
        },
      },
      getBySlug: {
        method: "GET",
        path: `/posts/:slug`,
        responses: {
          200: GetPostBySlugSchema,
        },
        summary: "Get a post by slug",
      },
    }),
  },
  {
    pathPrefix: "/api/v1",
    baseHeaders: z.object({
      authorization: z.string(), // Must be lowercase
    }),
    commonResponses: {
      404: z.object({
        message: z.string(),
      }),
      401: z
        .object({
          message: z.string(),
        })
        .openapi({
          description: "Unauthorized",
        }),
      429: z
        .object({
          message: z.string(),
        })
        .openapi({
          description: `Too Many Requests. The API is rate limited to ${RATELIMIT_CONFIG.limit} requests per ${RATELIMIT_CONFIG.window}.`,
        }),
    },
  }
);
