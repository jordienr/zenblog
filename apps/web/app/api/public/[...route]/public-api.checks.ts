/**
 * Checks if the code examples are valid with typescript
 */

import { createZenblogClient } from "zenblog";

const zenblog = createZenblogClient({
  blogId: "doesnt-matter",
});

const posts = await zenblog.posts.list({
  limit: 100,
  offset: 0,
  tags: ["tag1", "tag2"],
  category: "category-slug",
  author: "author-slug",
});
const postsBySlug = await zenblog.posts.get({
  slug: "slug",
});

const categories = await zenblog.categories.list();
const tags = await zenblog.tags.list();
const authors = await zenblog.authors.list();
const authorBySlug = await zenblog.authors.get({
  slug: "slug",
});

console.log(posts);
console.log(postsBySlug);
console.log(categories);
console.log(tags);
console.log(authors);
console.log(authorBySlug);
