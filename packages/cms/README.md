# Official zendo.blog API Client

## Install

```bash
    npm install @zendo/client
```

## Usage example

```typescript
import { createClient } from "@zendo/client";

const cms = createClient({
  blogId: "MY_BLOG_ID", // Go to your blog settings to get your blog id
});

const posts = await cms.posts.getAll();
const post = await cms.posts.getBySlug("post-slug");
```
