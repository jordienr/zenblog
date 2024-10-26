import { createSupabaseBrowserClient } from "@/lib/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const tagKeys = {
  tags: () => ["tags"],
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
    queryKey: tagKeys.tags(),
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
        .from("blog_tags")
        .delete()
        .eq("id", tagId)
        .eq("blog_id", blogId);

      if (res.error) {
        throw new Error(res.error.message);
      }

      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.tags() });
    },
  });
}

export function useUpdateTagMutation(blogId: string) {
  const queryClient = useQueryClient();
  const supa = createSupabaseBrowserClient();

  return useMutation({
    mutationFn: async (tag: { id: string; name: string; slug: string }) => {
      const res = await supa.from("blog_tags").update(tag).eq("id", tag.id);

      if (res.error) {
        throw new Error(res.error.message);
      }

      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.tags() });
    },
  });
}

export function usePostTags({
  postId,
  blogId,
}: {
  postId: string;
  blogId: string;
}) {
  const supa = createSupabaseBrowserClient();

  return useQuery({
    queryKey: tagKeys.tags(),
    enabled: !!postId,
    queryFn: async () => {
      const { data } = await supa
        .from("post_tags")
        .select("blog_tags(*)")
        .eq("post_id", postId);

      return data;
    },
  });
}
