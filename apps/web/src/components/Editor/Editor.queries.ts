import { createSupabaseBrowserClient } from "@/lib/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type UseTags = {
  blogId: string;
};
export const useBlogTags = ({ blogId }: UseTags) => {
  const sb = createSupabaseBrowserClient();

  const hasBlogId = !!blogId && blogId !== "demo";

  const query = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const { data, error } = await sb
        .from("tags")
        .select("*")
        .eq("blog_id", blogId);
      if (error) {
        throw error;
      }
      return data;
    },
    enabled: hasBlogId,
  });

  return query;
};

export const useCreateBlogTag = () => {
  const sb = createSupabaseBrowserClient();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (category: {
      name: string;
      slug: string;
      blog_id: string;
    }) => {
      const { data, error } = await sb.from("tags").insert(category);
      if (error) {
        throw error;
      }
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      return data;
    },
  });

  return mutation;
};
