import { createAPIClient } from "@/lib/http/api";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";

const api = createAPIClient();

export const useImages = (blogId: string) =>
  useQuery({
    queryKey: ["images", blogId],
    queryFn: () => api.images.getAll(blogId),
  });
