import { createAPIClient } from "@/lib/app/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const api = createAPIClient();

export const keys = {
  blogs: () => ["blogs"],
  blog: (blogId: string) => ["blog", blogId],
};

export const useBlogQuery = (blogId: string) =>
  useQuery(keys.blog(blogId), () => api.blogs.get(blogId));

export const useBlogsQuery = () =>
  useQuery(keys.blogs(), api.blogs.getAll, {
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 60 * 24, // 1 day
  });

export const useCreateBlogMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(api.blogs.create, {
    onSuccess: () => {
      queryClient.invalidateQueries(keys.blogs());
    },
  });
};
