import { createZenblogClient } from "zenblog";

export const createBlog = () => {
  const accessToken = process.env.ZENBLOG_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error("Missing ZENBLOG_ACCESS_TOKEN environment variable");
  }

  const blog = createZenblogClient({
    accessToken,
    _debug: true,
    _url: "http://localhost:3001/api/v1",
  });

  return blog;
};
