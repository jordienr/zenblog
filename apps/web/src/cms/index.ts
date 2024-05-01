import { createClient } from "zenblog";

const blogId = process.env.ZENBLOG_BLOG_ID || "";
export const getBlogClient = () => {
  const blog = createClient({
    blogId: blogId,
    _url: process.env.NEXT_PUBLIC_API_URL + "/public",
    debug: true,
  });

  return blog;
};

const docsId = process.env.ZENBLOG_DOCS_ID || "";
export const docs = createClient({
  blogId: docsId,
});
