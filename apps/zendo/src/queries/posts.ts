import { createAPIClient } from "@/lib/app/api";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

export const usePostsQuery = () => {
  const api = createAPIClient();
  const router = useRouter();
  const blogId = router.query.blogId as string;

  return useQuery(["posts", blogId], () => api.posts.getAll(blogId));
};
