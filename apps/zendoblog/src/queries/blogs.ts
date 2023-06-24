import { createAPIClient } from "@/lib/app/api";
import { useQuery } from "react-query";

const api = createAPIClient();

export const useBlogQuery = (blogId: string) =>
  useQuery(["blog", blogId], () => api.blogs.get(blogId));
