import { expect, test } from "vitest";
import { z } from "zod";

const authorsSchema = z.object({
  name: z.string(),
  slug: z.string(),
  image_url: z.string().optional(),
  twitter: z.string().optional(),
  website: z.string().optional(),
  bio: z.string().optional(),
});

const postSchema = z.object({
  title: z.string(),
  slug: z.string(),
  published_at: z.string(),
  excerpt: z.string(),
  cover_image: z.string(),
  tags: z.array(z.object({ name: z.string(), slug: z.string() })),
  authors: z.array(authorsSchema),
  category: z.object({ name: z.string(), slug: z.string() }),
});

const postsResponseSchema = z.object({
  data: z.array(postSchema),
});

const authorsResponseSchema = z.object({
  data: z.array(authorsSchema),
});

// const apiget = GET;

const BASE_URL =
  "http://localhost:8082/api/public/blogs/53a970ef-cc74-40ac-ac53-c322cd4848cb";

test("posts endpoint returns correct data", async () => {
  const response = await fetch(`${BASE_URL}/posts`);
  const data = await response.json();

  const parsedData = postsResponseSchema.parse(data);

  expect(parsedData.data.length).toBeGreaterThan(0);
});

test("posts limit and offset", async () => {
  const limit = 4;
  const offset = 0;

  const response = await fetch(
    `${BASE_URL}/posts?limit=${limit}&offset=${offset}`
  );

  const data = await response.json();

  const parsedData = postsResponseSchema.parse(data);

  expect(parsedData.data.length).toBe(limit);
});

test("posts endpoint filter by category", async () => {
  const category = "news";

  const response = await fetch(`${BASE_URL}/posts?category=${category}`);

  const data = await response.json();

  const parsedData = postsResponseSchema.parse(data);

  expect(parsedData.data.length).toBeGreaterThan(0);

  expect(parsedData.data[0]?.category?.slug).toBe(category);
});

test("posts endpoint filter by tag", async () => {
  const tags = ["random", "test"];

  const response = await fetch(`${BASE_URL}/posts?tags=${tags.join(",")}`);

  const data = await response.json();

  const parsedData = postsResponseSchema.parse(data);

  expect(parsedData.data.length).toBeGreaterThan(0);

  parsedData.data.forEach((post) => {
    post.tags.forEach((tag) => {
      expect(tag.slug).toBeOneOf(tags);
    });
  });
});

test("posts endpoint accepts multiple configuration of query params", async () => {
  const queries = [
    "category=hiking&tags=random,test",
    "tags=test,random&category=hiking",
    "tags=random,test&category=hiking&limit=4&offset=0",
    "limit=4&offset=2",
    "tags=random,test",
    "category=hiking",
  ];

  queries.forEach(async (query) => {
    const response = await fetch(`${BASE_URL}/posts?${query}`);
    const data = await response.json();
    const parsedData = postsResponseSchema.parse(data);
    expect(parsedData.data.length).toBeGreaterThan(0);
  });
});

test("posts endpoint filters by author correctly", async () => {
  const authorSlug = "carpincho";
  const response = await fetch(`${BASE_URL}/posts?author=${authorSlug}`);
  const data = await response.json();
  const parsedData = postsResponseSchema.parse(data);
  expect(parsedData.data.length).toBeGreaterThan(0);

  parsedData.data.forEach((post) => {
    post.authors.forEach((author) => {
      expect(author.slug).toBe(authorSlug);
    });
  });
});

test("authors endpoint returns correct data", async () => {
  const response = await fetch(`${BASE_URL}/authors`);
  const data = await response.json();
  const parsedData = authorsResponseSchema.parse(data);
  expect(parsedData.data.length).toBeGreaterThan(0);
});
