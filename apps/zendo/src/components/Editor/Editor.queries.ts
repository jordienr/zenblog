import { getSupabaseBrowserClient } from "@/lib/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type UseTags = {
  blogId: string;
};
export const useBlogTags = ({ blogId }: UseTags) => {
  const sb = getSupabaseBrowserClient();

  const query = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const { data, error } = await sb
        .from("blog_tags")
        .select("*")
        .eq("blog_id", blogId);
      if (error) {
        throw error;
      }
      return data;
    },
    enabled: !!blogId,
  });

  return query;
};

export const useCreateBlogTag = () => {
  const sb = getSupabaseBrowserClient();
  const queryClient = useQueryClient();

  const mutation = useMutation(
    async (category: { name: string; slug: string; blog_id: string }) => {
      const { data, error } = await sb.from("blog_tags").insert(category);
      if (error) {
        throw error;
      }
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["tags"]);
      },
    }
  );

  return mutation;
};
