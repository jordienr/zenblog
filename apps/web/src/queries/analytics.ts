import { useQuery } from "@tanstack/react-query";

export function usePostViewsQuery({ blog_id }: { blog_id: string }) {
  return useQuery({
    queryKey: ["post_views", blog_id],
    queryFn: async () => {
      const res = await fetch("/api/v1/a?blog_id=" + blog_id);
      const data = await res.json();
      return data;
    },
    enabled: !!blog_id,
  });
}
