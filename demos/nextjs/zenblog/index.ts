import { createClient } from "zenblog";

export const getBlog = () => {
  const blog = createClient({
    blogId: "53a970ef-cc74-40ac-ac53-c322cd4848cb",
    debug: true,
    _url: process.env.NEXT_PUBLIC_API_URL + "/public",
  });

  return blog;
};
