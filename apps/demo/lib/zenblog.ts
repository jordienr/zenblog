import { createZenblogClient } from "zenblog";

const DEFAULT_BLOG_ID = "53a970ef-cc74-40ac-ac53-c322cd4848cb";

if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is required");
}

export function getZenblogClient(blogId?: string) {
  return createZenblogClient({
    blogId: blogId || process.env.NEXT_PUBLIC_BLOG_ID || DEFAULT_BLOG_ID,
    _url: process.env.NEXT_PUBLIC_API_URL,
    _debug: true,
  });
}

// Default client for convenience
export const zenblog = getZenblogClient();
