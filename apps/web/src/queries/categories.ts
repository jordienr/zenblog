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

export function useCategoriesWithPostCount() {
  return useQuery({
    queryKey: ["categories-with-post-count"],
    queryFn: async () =>
      await sb
        .from("category_post_count")
        .select(
          "category_id, category_name, category_slug, post_count, created_at"
        )
        .throwOnError(),
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await sb
        .from("categories")
        .select("id, slug, name, created_at")
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

export function useDeleteCategoryMutation(blogId: string) {
  const queryClient = useQueryClient();
  const supa = createSupabaseBrowserClient();

  return useMutation({
    mutationFn: async (categoryId: string) => {
      const res = await supa
        .from("categories")
        .delete()
        .eq("id", categoryId)
        .eq("blog_id", blogId);

      if (res.error) {
        throw new Error(res.error.message);
      }

      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories-with-post-count"],
      });
    },
  });
}

export function useUpdateCategoryMutation() {
  const queryClient = useQueryClient();
  const supa = createSupabaseBrowserClient();

  return useMutation({
    mutationFn: async (category: {
      id: number;
      name: string;
      slug: string;
    }) => {
      const res = await supa
        .from("categories")
        .update(category)
        .eq("id", category.id);

      if (res.error) {
        throw new Error(res.error.message);
      }

      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories-with-post-count"],
      });
    },
  });
}
