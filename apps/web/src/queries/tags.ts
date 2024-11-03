import { createSupabaseBrowserClient } from "@/lib/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const tagKeys = {
  tags: (blogId: string) => ["tags", blogId],
  postTags: (postId: string) => ["postTags", postId],
  tag: (tagId: string) => ["tags", tagId],
};

export function useTagsWithUsageQuery(
  { blogId }: { blogId: string },
  {
    enabled,
  }: {
    enabled: boolean;
  }
) {
  const supa = createSupabaseBrowserClient();

  return useQuery({
    queryKey: tagKeys.tags(blogId),
    enabled: !!blogId && enabled,
    queryFn: async () => {
      const { data } = await supa
        .from("tag_usage_count_v2")
        .select("*")
        .eq("blog_id", blogId);

      return data;
    },
  });
}

export function useDeleteTagMutation(blogId: string) {
  const queryClient = useQueryClient();
  const supa = createSupabaseBrowserClient();

  return useMutation({
    mutationFn: async (tagId: string) => {
      const res = await supa
        .from("tags")
        .delete()
        .eq("id", tagId)
        .eq("blog_id", blogId);

      if (res.error) {
        throw new Error(res.error.message);
      }

      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.tags(blogId) });
    },
  });
}

export function useUpdateTagMutation(blogId: string) {
  const queryClient = useQueryClient();
  const supa = createSupabaseBrowserClient();

  return useMutation({
    mutationFn: async (tag: { id: string; name: string; slug: string }) => {
      const res = await supa.from("tags").update(tag).eq("id", tag.id);

      if (res.error) {
        throw new Error(res.error.message);
      }

      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.tags(blogId) });
    },
  });
}

export function usePostTags({
  post_id,
  blog_id,
}: {
  post_id: string;
  blog_id: string;
}) {
  const supa = createSupabaseBrowserClient();

  return useQuery({
    queryKey: tagKeys.postTags(post_id),
    enabled: !!post_id && !!blog_id,
    queryFn: async () => {
      const { data } = await supa
        .from("post_tags")
        .select("tags(id, name, slug)")
        .eq("post_id", post_id)
        .eq("tags.blog_id", blog_id);

      return data;
    },
  });
}
