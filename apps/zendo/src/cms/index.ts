import { createClient } from "zenblog";

export const getBlogClient = () => {
  const blog = createClient({
    blogId: "fc966b9f-419c-4c40-a941-c1122cac8875",
    _url: "http://localhost:3000/api/public",
    debug: true,
  });

  return blog;
};

export const docs = createClient<{ metadata: { order: number } }>({
  blogId: "12cc7bb4-4ea8-452d-a17d-5a15b148ae33",
  debug: true,
  _url: "http://localhost:3000/api/public",
});
