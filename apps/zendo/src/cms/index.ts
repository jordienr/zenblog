import { createClient } from "zenblog";

export const getBlogClient = () => {
  const blog = createClient({
    blogId: "fc966b9f-419c-4c40-a941-c1122cac8875",
  });

  return blog;
};
