import { API } from "app/utils/api-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const keys = {
  blogs: () => ["blogs"],
  blog: (blogId: string) => ["blog", blogId],
};

export type Blog = {
  id: string;
  title: string;
  emoji: string;
  description: string;
  created_at: string;
  slug: string | null;
  theme: string;
  twitter: string;
  instagram: string;
  website: string;
  access_token: string | null;
};

const api = API();

export const useBlogQuery = (blogId: string) =>
  useQuery({
    queryKey: keys.blog(blogId),
    queryFn: async () => {
      const res = await api.v2.blogs[":blog_id"].$get({
        param: { blog_id: blogId },
      });
      if (!res.ok) {
        throw new Error("Failed to load blog");
      }
      return (await res.json()) as Blog;
    },
    enabled: !!blogId && blogId !== "demo",
  });

export const useBlogsQuery = ({ enabled }: { enabled: boolean }) =>
  useQuery({
    enabled,
    queryKey: keys.blogs(),
    queryFn: async () => {
      const res = await api.v2.blogs.$get();
      if (!res.ok) {
        throw new Error("Failed to load blogs");
      }
      return (await res.json()) as Blog[];
    },
    staleTime: 5 * 60 * 1000,
  });

export const useCreateBlogMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newBlog: {
      title: string;
      description: string;
      emoji: string;
    }) => {
      const res = await api.v2.blogs.$post({
        json: newBlog,
      });
      if (!res.ok) {
        return { data: null, error: { message: "Failed to create blog" } };
      }
      return {
        data: (await res.json()) as Blog,
        error: null as null | { message: string; code?: string },
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.blogs() });
    },
  });
};

export const useUpdateBlogMutation = (opts?: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();

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
      const res = await api.v2.blogs[":blog_id"].$patch({
        param: { blog_id: blogData.id },
        json: {
          title: blogData.title,
          description: blogData.description,
          emoji: blogData.emoji,
          theme: blogData.theme,
          access_token: blogData.access_token,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to update blog");
      }
      return (await res.json()) as Blog;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.blogs() });
      opts?.onSuccess?.();
    },
  });
};

export const useDeleteBlogMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (blogId: string) => {
      const res = await api.v2.blogs[":blog_id"].$delete({
        param: { blog_id: blogId },
      });
      if (!res.ok) {
        throw new Error("Failed to delete blog");
      }
      return (await res.json()) as { ok: boolean };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.blogs() });
    },
  });
};
