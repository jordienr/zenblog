// contract.ts

import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { extendZodWithOpenApi } from "@anatine/zod-openapi";

extendZodWithOpenApi(z);
const c = initContract();

const PostSchema = z.object({
  slug: z
    .string()
    .openapi({ description: "The id of the post", example: "hello-world" }),
  title: z
    .string()
    .openapi({ description: "The title of the post", example: "Hello World!" }),
  html_content: z.string().openapi({
    description: "The body of the post",
    example: "<p>This is my first post!</p>",
  }),
});

export const contract = c.router(
  {
    getPosts: {
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
        200: z.array(PostSchema),
      },
    },
    getPostBySlug: {
      method: "GET",
      path: `/posts/:slug`,
      responses: {
        200: PostSchema,
      },
      summary: "Get a post by slug",
    },
  },
  {
    pathPrefix: "/api/v1",
    BaseHeaders: {
      headers: {
        Authorization: z.string(),
      },
    },
    commonResponses: {
      401: z
        .object({
          message: z.string(),
        })
        .openapi({
          description: "Unauthorized",
        }),
    },
  }
);
