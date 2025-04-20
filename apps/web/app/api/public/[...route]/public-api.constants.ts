import { Endpoint } from "./public-api.types";

export const BASE_API_URL = "https://zenblog.com/api/public";

export const posts: Endpoint = {
  id: "posts",
  path: "/blogs/:blogId/posts",
  method: "GET",
  title: "Post list",
  description: "Get posts for a blog",
  query: [
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
    {
      key: "category",
      required: false,
      description:
        "The category slug to filter posts by. Example: &category=news",
    },
    {
      key: "tags",
      required: false,
      description:
        "The tags to filter posts by. Ex: &tags=random,test. Multiple tags are possible.",
    },
    {
      key: "author",
      required: false,
      description: "The author slug to filter posts by. Ex: &author=carpincho",
    },
  ],
  response: {
    200: {
      description: "The posts",
      type: "object",
      example: `{
  data: [{ 
    title: "string",
    html_content: "string",
    slug: "string",
    category?: {
      name: "string",
      slug: "string",
    },
    tags?: [{
      name: "string",
      slug: "string",
    }],
    excerpt?: "string",
    published_at: "string",
    authors?: [{
      slug: "string",
      name: "string",
      image_url?: "string",
      website?: "string",
      twitter?: "string",
    }],
  }],
  total?: number,
  offset?: number,
  limit?: number,
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
  response: {
    200: {
      description: "The categories",
      type: "object",
      example: `{
  data: [
  {
    name: "string",
    slug: "string",
  }
],
  total?: number,
  offset?: number,
  limit?: number,
}`,
    },
  },
};
export const tags: Endpoint = {
  id: "tags",
  path: "/blogs/:blogId/tags",
  method: "GET",
  title: "Tags list",
  description: "Get the tags for a blog",
  response: {
    200: {
      description: "The tags",
      type: "object",
      example: `{
  data: [
  {
    name: "string",
    slug: "string",
  }
],
  total?: number,
  offset?: number,
  limit?: number,
}`,
    },
  },
};

export const authors: Endpoint = {
  id: "authors",
  path: "/blogs/:blogId/authors",
  method: "GET",
  title: "Authors list",
  description: "Get the authors for a blog",
  typescriptExample: `
  const { data: authors } = await zenblogClient.authors.list()
  `,
  response: {
    200: {
      description: "The authors",
      type: "object",
      example: `{ data: [
  {
    name: "string",
    slug: "string",
    image_url?: "string",
    twitter?: "string",
    website?: "string",
    bio?: "string",
  }
],
  total?: number,
  offset?: number,
  limit?: number,
}`,
    },
  },
};

export const authorBySlug: Endpoint = {
  id: "authorBySlug",
  path: "/blogs/:blogId/authors/:slug",
  method: "GET",
  title: "Author detail",
  description: "Get an author by their slug",
  response: {
    200: {
      description: "The author",
      type: "object",
      example: `{
  data: {
    name: "string",
    slug: "string",
    image_url?: "string",
    twitter?: "string",
    website?: "string",
    bio?: "string",
  }
}`,
    },
  },
};

export const endpoints = [
  posts,
  postBySlug,
  categories,
  tags,
  authors,
  authorBySlug,
];
