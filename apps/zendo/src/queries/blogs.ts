import { createAPIClient } from "@/lib/http/api";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const api = createAPIClient();

export const keys = {
  blogs: () => ["blogs"],
  blog: (blogId: string) => ["blog", blogId],
};

const sb = getSupabaseBrowserClient();

export const useBlogQuery = (blogId: string) =>
  useQuery(
    keys.blog(blogId),
    async () => {
      const res = await sb.from("blogs").select("*").eq("id", blogId).single();
      return res.data;
    },
    {
      enabled: !!blogId,
    }
  );

export const useBlogsQuery = () =>
  useQuery(
    keys.blogs(),
    async () => {
      const { data, error } = await sb.from("blogs").select("*");
      if (error) {
        throw error;
      }
      return data;
    },
    {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 60 * 24, // 1 day
    }
  );

export const useCreateBlogMutation = () => {
  const queryClient = useQueryClient();
  const supa = getSupabaseBrowserClient();

  return useMutation(
    async (newBlog: { title: string; description: string; emoji: string }) => {
      const res = await supa.from("blogs").insert(newBlog).select().single();
      return res.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(keys.blogs());
      },
    }
  );
};
