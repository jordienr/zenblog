import { getSupabaseBrowserClient } from "@/lib/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const keys = {
  blogs: () => ["blogs"],
  blog: (blogId: string) => ["blog", blogId],
};

const sb = getSupabaseBrowserClient();

export const useBlogQuery = (blogId: string) =>
  useQuery({
    queryKey: keys.blog(blogId),
    queryFn: async () => {
      const res = await sb
        .from("blogs")
        .select("id, title, emoji, description, created_at, slug")
        .eq("id", blogId)
        .single();
      return res.data;
    },
    enabled: !!blogId && blogId !== "demo",
  });

export const useBlogsQuery = () =>
  useQuery({
    queryKey: keys.blogs(),
    queryFn: async () => {
      const { data, error } = await sb.from("blogs").select("*");
      if (error) {
        throw error;
      }
      return data;
    },
  });

export const useCreateBlogMutation = () => {
  const queryClient = useQueryClient();
  const supa = getSupabaseBrowserClient();

  return useMutation({
    mutationFn: async (newBlog: {
      title: string;
      description: string;
      emoji: string;
      slug: string;
    }) => {
      const res = await supa.from("blogs").insert(newBlog).select().single();
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.blogs() });
    },
  });
};

export const useUpdateBlogMutation = () => {
  const queryClient = useQueryClient();
  const supa = getSupabaseBrowserClient();

  return useMutation({
    mutationFn: async (blogData: {
      id: string;
      title: string;
      description: string;
      emoji: string;
    }) => {
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
    },
  });
};

export const useDeleteBlogMutation = () => {
  const queryClient = useQueryClient();
  const supa = getSupabaseBrowserClient();

  return useMutation({
    mutationFn: async (blogId: string) => {
      await supa.from("blogs").delete().eq("id", blogId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.blogs() });
    },
  });
};
