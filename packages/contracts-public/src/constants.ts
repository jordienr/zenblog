import type { Endpoint } from "./types";

export const BASE_API_URL = "https://zenblog.com/api/public";

export const posts: Endpoint = {
  id: "posts",
  path: "/blogs/:blogId/posts",
  method: "GET",
  title: "Post list",
  description: "Get posts for a blog",
  examples: {
    typescript: [
      {
        description: "Get posts for a blog",
        code: `const { data: posts } = await zenblog.posts.list()`,
      },
    ],
  },
  query: [
    { key: "offset", required: false, description: "The offset for the posts" },
    { key: "limit", required: false, description: "The limit for the posts" },
    {
      key: "category",
      required: false,
      description: "The category slug to filter posts by.",
    },
    {
      key: "tags",
      required: false,
      description: "Comma-separated tag slugs to filter posts by.",
    },
    {
      key: "author",
      required: false,
      description: "The author slug to filter posts by.",
    },
  ],
  response: {
    200: {
      description: "The posts",
      type: "object",
      example: `{
  "data": [],
  "total": 0,
  "offset": 0,
  "limit": 30
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
  "data": {
    "title": "string",
    "slug": "string",
    "published_at": "string",
    "html_content": "string"
  }
}`,
    },
  },
  examples: {
    typescript: [
      {
        description: "Get a post by its slug",
        code: `const { data: post } = await zenblog.posts.get({ slug: "post-slug" })`,
      },
    ],
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
      example: `{"data":[]}`,
    },
  },
  examples: {
    typescript: [
      {
        description: "Get the categories for a blog",
        code: `const { data: categories } = await zenblog.categories.list()`,
      },
    ],
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
      example: `{"data":[]}`,
    },
  },
  examples: {
    typescript: [
      {
        description: "Get the tags for a blog",
        code: `const { data: tags } = await zenblog.tags.list()`,
      },
    ],
  },
};

export const authors: Endpoint = {
  id: "authors",
  path: "/blogs/:blogId/authors",
  method: "GET",
  title: "Authors list",
  description: "Get the authors for a blog",
  response: {
    200: {
      description: "The authors",
      type: "object",
      example: `{"data":[]}`,
    },
  },
  examples: {
    typescript: [
      {
        description: "Get the authors for a blog",
        code: `const { data: authors } = await zenblog.authors.list()`,
      },
    ],
  },
};

export const authorBySlug: Endpoint = {
  id: "authorBySlug",
  path: "/blogs/:blogId/authors/:slug",
  method: "GET",
  title: "Author detail",
  description: "Get an author by slug",
  response: {
    200: {
      description: "The author",
      type: "object",
      example: `{"data":{"name":"string","slug":"string"}}`,
    },
  },
  examples: {
    typescript: [
      {
        description: "Get an author by slug",
        code: `const { data: author } = await zenblog.authors.get({ slug: "author-slug" })`,
      },
    ],
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
