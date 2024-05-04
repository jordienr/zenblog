import { getSupabaseBrowserClient } from "@/lib/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const tagKeys = {
  tags: (keys: string[]) => ["tags", ...keys],
  tag: (tagId: string) => ["tag", tagId],
};

export function useTagsWithUsageQuery(
  { blogId }: { blogId: string },
  {
    enabled,
  }: {
    enabled: boolean;
  }
) {
  const supa = getSupabaseBrowserClient();

  return useQuery({
    queryKey: tagKeys.tags([blogId]),
    enabled: !!blogId && enabled,
    queryFn: async () => {
      const { data } = await supa
        .from("tag_usage_count_v1")
        .select("*")
        .eq("blog_id", blogId);

      return data;
    },
  });
}

export function useDeleteTagMutation() {
  const queryClient = useQueryClient();
  const supa = getSupabaseBrowserClient();

  return useMutation(
    async (tagId: string) => {
      const res = await supa.from("blog_tags").delete().eq("id", tagId);

      return res;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(tagKeys.tags([""]));
      },
    }
  );
}

export function useUpdateTagMutation() {
  const queryClient = useQueryClient();
  const supa = getSupabaseBrowserClient();

  return useMutation(
    async (tag: { id: string; name: string; slug: string }) => {
      const res = await supa.from("blog_tags").update(tag).eq("id", tag.id);

      return res;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(tagKeys.tags([""]));
      },
    }
  );
}

export function usePostTags({
  postId,
  blogId,
}: {
  postId: string;
  blogId: string;
}) {
  const supa = getSupabaseBrowserClient();

  return useQuery({
    queryKey: tagKeys.tags([postId, blogId]),
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
