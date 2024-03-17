import { createClient } from "zenblog";

export const blog = createClient({
  blogId: import.meta.env.ZENBLOG_DEMO_BLOG_ID,
  _url: import.meta.env.ZENBLOG_DEMO_BLOG_API_URL,
});
