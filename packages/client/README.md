# Official zendo.blog API Client

## Install

```bash
    npm install @znd/client
```

## Usage example

```typescript
import { createClient } from "@zendoblog/client";

const cms = createClient({
  blogId: "MY_BLOG_ID", // Go to your blog settings to get your blog id
});

const posts = await cms.posts.getAll();
const post = await cms.posts.getBySlug("post-slug");
```
