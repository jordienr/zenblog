# Official zenblog API Client

## Install

```bash
    npm install zenblog
```

## Usage example

```typescript
import { createClient } from "zenblog";

const cms = createClient({
  blogId: "MY_BLOG_ID", // Go to your blog settings to get your blog id
});

const posts = await cms.posts.getAll();
const post = await cms.posts.getBySlug("post-slug");
```
