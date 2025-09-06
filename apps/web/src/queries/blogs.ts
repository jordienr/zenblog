import { createSupabaseBrowserClient } from "@/lib/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API, handleAPIError } from "app/utils/api-client";

export const keys = {
  blogs: () => ["blogs"],
  blog: (blogId: string) => ["blog", blogId],
};

const sb = createSupabaseBrowserClient();

export const useBlogQuery = (blogId: string) =>
  useQuery({
    queryKey: keys.blog(blogId),
    queryFn: async () => {
      const api = API();

      const res = await api.v2.blogs[":blog_id"].$get({
        param: { blog_id: blogId },
      });

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      return data.data;
    },
    enabled: !!blogId && blogId !== "demo",
  });

export const useBlogsQuery = ({ enabled }: { enabled: boolean }) => {
  const api = API();
  return useQuery({
    enabled,
    queryKey: keys.blogs(),
    queryFn: async () => {
      const res = await api.v2.blogs.$get();

      const data = await res.json();

      // Type guard to check if response has blogs
      if ("blogs" in data && Array.isArray(data.blogs)) {
        return data.blogs;
      }

      throw new Error("Invalid response format from blogs API");
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateBlogMutation = () => {
  const queryClient = useQueryClient();
  const supa = createSupabaseBrowserClient();

  return useMutation({
    mutationFn: async (newBlog: {
      title: string;
      description: string;
      emoji: string;
      // slug: string;
    }) => {
      const res = await supa.from("blogs").insert(newBlog).select().single();
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.blogs() });
    },
  });
};

export const useUpdateBlogMutation = (opts?: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();
  const supa = createSupabaseBrowserClient();

  return useMutation({
    mutationFn: async (
      blogData: { id: string } & Partial<{
        title: string;
        description: string;
        emoji: string;
        theme: string;
        access_token: string;
      }>
    ) => {
      const res = await supa
        .from("blogs")
        .update(blogData)
        .eq("id", blogData.id)
        .select()
        .single();
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.blogs() });
      opts?.onSuccess?.();
    },
  });
};

export const useDeleteBlogMutation = () => {
  const queryClient = useQueryClient();
  const supa = createSupabaseBrowserClient();

  return useMutation({
    mutationFn: async (blogId: string) => {
      await supa.from("blogs").delete().eq("id", blogId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.blogs() });
    },
  });
};
