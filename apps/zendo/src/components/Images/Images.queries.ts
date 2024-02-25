import { createAPIClient } from "@/lib/http/api";
import { useQuery } from "@tanstack/react-query";

const api = createAPIClient();

export const useImages = (blogId: string) =>
  useQuery(["images"], () => api.images.getAll(blogId));
