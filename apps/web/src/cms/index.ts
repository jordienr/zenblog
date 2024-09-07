import { createZenblogClient } from "zenblog";

const blogId = process.env.ZENBLOG_BLOG_ID || "";
export const getBlogClient = () => {
  const blog = createZenblogClient({
    accessToken: blogId,
    _url: process.env.NEXT_PUBLIC_API_URL + "/public",
    _debug: true,
  });

  return blog;
};

const docsId = process.env.ZENBLOG_DOCS_ID || "";
export const docs = createZenblogClient({
  accessToken: docsId,
});
