import { createZenblogClient } from "zenblog";

export const createBlog = () => {
  const accessToken = process.env.ZENBLOG_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error("No blog ID provided");
  }

  const blog = createZenblogClient({
    accessToken,
  });

  return blog;
};
