import { createClient } from "zenblog";

export const getBlog = () => {
  const blogId = process.env.ZENBLOG_DEMO_BLOG_ID;
  console.log("BLOG ID_______", blogId);

  if (!blogId) {
    throw new Error("No blog ID provided");
  }

  const blog = createClient({
    blogId,
    debug: true,
    _url: process.env.NEXT_PUBLIC_API_URL + "/public",
  });

  return blog;
};
