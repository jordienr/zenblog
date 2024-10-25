import { createSupabaseBrowserClient } from "@/lib/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const sb = createSupabaseBrowserClient();

const keys = {
  list: ["categories", "categories-with-post-count"],
};

type Category = {
  id: string;
  slug: string;
  name: string;
  created_at: string;
  blog_id: string;
};

export function useCategoriesWithPostCount() {
  return useQuery({
    queryKey: keys.list,
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
    queryKey: keys.list,
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
      queryClient.invalidateQueries({ queryKey: keys.list });
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
        .eq("blog_id", blogId)
        .throwOnError();

      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: keys.list,
      });
    },
    onError: (error) => {
      toast.error(error.message);
      console.error(error);
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
        .eq("id", category.id)
        .throwOnError();

      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: keys.list,
      });
    },
    onError: (error) => {
      toast.error(error.message);
      console.error(error);
    },
  });
}
