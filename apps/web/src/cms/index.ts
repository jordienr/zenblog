import { createZenblogClient } from "zenblog";

export const getBlogClient = () => {
  const blog = createZenblogClient({
    blogId: process.env.ZENBLOG_BLOG_ID || "",
    _url: process.env.NEXT_PUBLIC_API_URL + "/public",
    _debug: true,
  });

  return blog;
};
