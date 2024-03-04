import { createAPIClient } from "@/lib/http/api";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";

const api = createAPIClient();

type QueryFnData = {
  id: string;
  url: string;
  blog_id: string;
};

export const useImages = (blogId: string) =>
  useQuery({
    queryKey: ["images", blogId],
    queryFn: () => api.images.getAll(blogId),
  });
