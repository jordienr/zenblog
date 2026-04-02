import { createSupabaseBrowserClient } from "@/lib/supabase";
import { API } from "app/utils/api-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const api = API();

type TagUsageRow = {
  tag_id: string | null;
  tag_name: string | null;
  slug: string | null;
  post_count: number | null;
  created_at: string | null;
  updated_at: string | null;
  blog_id: string | null;
};

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
  return useQuery({
    queryKey: tagKeys.tags(blogId),
    enabled: !!blogId && enabled,
    queryFn: async () => {
      const res = await api.v2.blogs[":blog_id"].tags.usage.$get({
        param: { blog_id: blogId },
      });
      if (!res.ok) {
        throw new Error("Failed to load tag usage");
      }
      const data = (await res.json()) as Array<{
        tagId: string | null;
        tagName: string | null;
        slug: string | null;
        postCount: number | null;
        createdAt: string | null;
        updatedAt: string | null;
        blogId: string | null;
      }>;
      return data.map((tag): TagUsageRow => ({
        tag_id: tag.tagId,
        tag_name: tag.tagName,
        slug: tag.slug,
        post_count: tag.postCount,
        created_at: tag.createdAt,
        updated_at: tag.updatedAt,
        blog_id: tag.blogId,
      }));
    },
  });
}

export function useDeleteTagMutation(blogId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tagId: string) => {
      const res = await api.v2.blogs[":blog_id"].tags[":tag_id"].$delete({
        param: { blog_id: blogId, tag_id: tagId },
      });

      if (!res.ok) {
        return { error: { message: "Failed to delete tag" } };
      }

      return { error: null, data: (await res.json()) as { ok: boolean } };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.tags(blogId) });
    },
  });
}

export function useUpdateTagMutation(blogId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tag: { id: string; name: string; slug: string }) => {
      const res = await api.v2.blogs[":blog_id"].tags[":tag_id"].$patch({
        param: { blog_id: blogId, tag_id: tag.id },
        json: {
          name: tag.name,
          slug: tag.slug,
        },
      });

      if (!res.ok) {
        return { error: { message: "Failed to update tag" } };
      }

      return {
        error: null,
        data: (await res.json()) as {
          id: string;
          name: string;
          slug: string;
        },
      };
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
