import { expect, test } from "vitest";
import { createZenblogClient } from "../src/index";

const DEMO_BLOG_ID = "53a970ef-cc74-40ac-ac53-c322cd4848cb";

test("Creates a zenblog client", async () => {
  const client = createZenblogClient({
    blogId: DEMO_BLOG_ID,
  });

  expect(client).toBeDefined();
});

test("Posts list", async () => {
  const client = createZenblogClient({
    blogId: DEMO_BLOG_ID,
  });

  const posts = await client.posts.list();
  console.log(posts);
  expect(posts).toBeDefined();
  expect(posts.data).toBeDefined();
  expect(posts.data.length).toBeGreaterThan(0);
  expect(posts.total).toBeDefined();
  expect(posts.offset).toBeDefined();
  expect(posts.limit).toBeDefined();

  // pagination types
  expect(typeof posts.limit).toBe("number");
  expect(typeof posts.offset).toBe("number");
  expect(typeof posts.total).toBe("number");
});

test("Posts get by slug", async () => {
  const client = createZenblogClient({
    blogId: DEMO_BLOG_ID,
  });

  const post = await client.posts.get({ slug: "test" });
  expect(post).toBeDefined();
  expect(post.data).toBeDefined();
  expect(post.data.slug).toBe("test");
  expect(post.data.html_content).toBeDefined();
});

test("Authors list", async () => {
  const client = createZenblogClient({
    blogId: DEMO_BLOG_ID,
  });

  const authors = await client.authors.list();
  expect(authors).toBeDefined();
  expect(authors.data).toBeDefined();
  expect(authors.data.length).toBeGreaterThan(0);
  expect(authors.total).toBeDefined();
  expect(authors.offset).toBeDefined();
  expect(authors.limit).toBeDefined();
});

test("Tags list", async () => {
  const client = createZenblogClient({
    blogId: DEMO_BLOG_ID,
  });

  const tags = await client.tags.list();
  expect(tags).toBeDefined();
  expect(tags.data).toBeDefined();
  expect(tags.data.length).toBeGreaterThan(0);
  expect(tags.total).toBeDefined();
  expect(tags.offset).toBeDefined();
  expect(tags.limit).toBeDefined();
});

test("Categories list", async () => {
  const client = createZenblogClient({
    blogId: DEMO_BLOG_ID,
  });

  const categories = await client.categories.list();
  expect(categories).toBeDefined();
  expect(categories.data).toBeDefined();
  expect(categories.data.length).toBeGreaterThan(0);
  expect(categories.total).toBeDefined();
  expect(categories.offset).toBeDefined();
  expect(categories.limit).toBeDefined();
});
