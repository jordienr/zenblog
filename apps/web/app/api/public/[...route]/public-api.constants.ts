import { Endpoint } from "./public-api.types";

export const BASE_API_URL = "https://zenblog.com/api/public";

export const posts: Endpoint = {
  id: "posts",
  path: "/blogs/:blogId/posts",
  method: "GET",
  title: "Post list",
  description: "Get posts for a blog",
  headers: [
    {
      key: "offset",
      required: false,
      description: "The offset for the posts",
    },
    {
      key: "limit",
      required: false,
      description: "The limit for the posts",
    },
  ],
  response: {
    200: {
      description: "The posts",
      type: "object",
      example: `{
  posts: { 
    title: "string",
    html_content: "string",
    slug: "string",
    category_name: "string", // nullable
    category_slug: "string", // nullable
    tags: "object",
    excerpt: "string", // nullable
    published_at: "string",
  },
  total: "number", // The total number of posts
  offset: "number", // The offset
  limit: "number", // The limit
}`,
    },
  },
};
export const postBySlug: Endpoint = {
  id: "postBySlug",
  path: "/blogs/:blogId/posts/:slug",
  method: "GET",
  title: "Post detail",
  description: "Get a post by its slug",
  headers: [],
  response: {
    200: {
      description: "The post",
      type: "object",
      example: `{
title: "string",
html_content: "string",
slug: "string",
category_name: "string",
category_slug: "string",
tags: "object",
excerpt: "string",
published_at: "string",
}`,
    },
  },
};
export const categories: Endpoint = {
  id: "categories",
  path: "/blogs/:blogId/categories",
  method: "GET",
  title: "Categories list",
  description: "Get the categories for a blog",
  headers: [],
  response: {
    200: {
      description: "The categories",
      type: "object",
      example: `[
  {
    name: "string",
    slug: "string",
  }
]`,
    },
  },
};
export const tags: Endpoint = {
  id: "tags",
  path: "/blogs/:blogId/tags",
  method: "GET",
  title: "Tags list",
  description: "Get the tags for a blog",
  headers: [],
  response: {
    200: {
      description: "The tags",
      type: "object",
      example: `[
  {
    name: "string",
    slug: "string",
  }
]`,
    },
  },
};

export const endpoints = [posts, postBySlug, categories, tags];
