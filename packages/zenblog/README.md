# Official zenblog API Client

This is the official typescript client for zenblog.

Link to docs: [https://zenblog.com/docs](https://zenblog.com/docs)
Link to the official website: [https://zenblog.com](https://zenblog.com)

## Install

```bash
    npm install zenblog
```

## Usage example

```typescript
import { createZenblogClient } from "zenblog";

const cms = createZenblogClient({
  blogId: "MY_BLOG_ID", // Go to your blog settings to get your blog id
});

const posts = await cms.posts.list();
const post = await cms.posts.get({ slug: "post-slug" });
```
