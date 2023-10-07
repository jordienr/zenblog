# zendoblog

## MVP To Do

- Create API Client functions
- Create API Client to fetch blogs from API
- Load blogs locally and refresh for faster navigation
- [x] Add API Keys CRUD for Blogs
- [x] Improve loading states in buttons

## Post MVP To Do

- Feedback widget (open source) for supabase
- Pageview counter for blogs

## Usage example

```typescript
import { createClient } from "@zendo/blog";

const cms = createClient({
  apiKey: "YOUR_BLOG_API_KEY",
});

const posts = await cms.getAll();
const post = await cms.getBySlug("blog-slug");
```

```typescript
type Post = {
  title: string; // ✅
  slug: string; // ✅
  content: string; // ✅
  createdAt: string; // ✅
  published: boolean; // ✅
  updatedAt: string; // 🚧
  tags: string[]; // 🚧
  publishedAt: string; // 🚧
  views: number; // 🚧
  coverImage: string; // 🚧
};
```

## Resources

https://upstash.com/blog/nextjs13-approuter-view-counter
