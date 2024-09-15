import { createSupabaseBrowserClient } from "@/lib/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const sb = createSupabaseBrowserClient();

type Category = {
  id: string;
  slug: string;
  name: string;
  created_at: string;
  blog_id: string;
};

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await sb
        .from("categories")
        .select("*")
        .throwOnError();
      if (error) {
        throw error;
      }
      return data;
    },
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (category: Omit<Category, "id" | "created_at">) =>
      await sb.from("categories").insert(category).throwOnError(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
