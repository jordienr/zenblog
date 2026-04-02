import { API } from "app/utils/api-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const api = API();

const keys = {
  list: ["categories", "categories-with-post-count"],
};

type Category = {
  id: number;
  slug: string;
  name: string;
  created_at: string;
  blog_id: string;
};

type CategoryUsage = {
  category_id: number | null;
  category_name: string | null;
  category_slug: string | null;
  post_count: number | null;
  created_at: string | null;
  blog_id: string | null;
};

export function useCategoriesWithPostCount(blogId: string) {
  return useQuery({
    queryKey: keys.list,
    queryFn: async () => {
      const res = await api.v2.blogs[":blog_id"].categories.usage.$get({
        param: { blog_id: blogId },
      });
      if (!res.ok) {
        throw new Error("Failed to load category usage");
      }
      const data = (await res.json()) as Array<{
        categoryId: number | null;
        categoryName: string | null;
        categorySlug: string | null;
        postCount: number | null;
        createdAt: string | null;
        blogId: string | null;
      }>;
      return {
        data: data.map((category): CategoryUsage => ({
          category_id: category.categoryId,
          category_name: category.categoryName,
          category_slug: category.categorySlug,
          post_count: category.postCount,
          created_at: category.createdAt,
          blog_id: category.blogId,
        })),
        error: null,
      };
    },
  });
}

export function useCategories(blogId: string) {
  return useQuery({
    queryKey: keys.list,
    queryFn: async () => {
      const res = await api.v2.blogs[":blog_id"].categories.$get({
        param: { blog_id: blogId },
      });
      if (!res.ok) {
        throw new Error("Failed to load categories");
      }
      return (await res.json()) as Category[];
    },
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (category: Omit<Category, "id" | "created_at">) => {
      const res = await api.v2.blogs[":blog_id"].categories.$post({
        param: { blog_id: category.blog_id },
        json: {
          name: category.name,
          slug: category.slug,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to create category");
      }
      const data = (await res.json()) as {
        id: number;
        blogId: string;
        name: string;
        slug: string;
        createdAt: string;
      };
      return {
        data: {
          id: data.id,
          blog_id: data.blogId,
          name: data.name,
          slug: data.slug,
          created_at: data.createdAt,
        } as Category,
        error: null,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.list });
    },
  });
}

export function useDeleteCategoryMutation(blogId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categoryId: string) => {
      const res = await api.v2.blogs[":blog_id"].categories[":category_id"].$delete({
        param: { blog_id: blogId, category_id: categoryId },
      });
      if (!res.ok) {
        throw new Error("Failed to delete category");
      }
      return { data: (await res.json()) as { ok: boolean }, error: null };
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

  return useMutation({
    mutationFn: async (category: {
      id: number;
      blog_id: string;
      name: string;
      slug: string;
    }) => {
      const res = await api.v2.blogs[":blog_id"].categories[":category_id"].$patch({
        param: {
          blog_id: category.blog_id,
          category_id: String(category.id),
        },
        json: {
          name: category.name,
          slug: category.slug,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to update category");
      }

      const data = (await res.json()) as {
        id: number;
        blogId: string;
        name: string;
        slug: string;
        createdAt: string;
      };

      return {
        data: {
          id: data.id,
          blog_id: data.blogId,
          name: data.name,
          slug: data.slug,
          created_at: data.createdAt,
        } as Category,
        error: null,
      };
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
