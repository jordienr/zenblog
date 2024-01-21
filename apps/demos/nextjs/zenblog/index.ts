import { createClient } from "zenblog";

export const getBlog = () => {
  const blog = createClient({
    blogId: "53a970ef-cc74-40ac-ac53-c322cd4848cb",
    debug: true,
    _url: "http://localhost:3000/api/public",
  });

  return blog;
};
