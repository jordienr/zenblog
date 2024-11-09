import { createZenblogClient } from "../dist";

const client = createZenblogClient({ blogId: "123"});

client.posts.list({ category: "nextjs" });
