# Official zendo.blog API Client

## Install

```bash
    npm install @zendoblog/client
```

## Usage example

```typescript
import { createClient } from "@zendoblog/client";

const cms = createClient({
  privateKey: "MY_PRIVATE_KEY", // Go to your blog settings to get your private key
});

const posts = await cms.getAll();
const post = await cms.getBySlug("blog-slug");
```
