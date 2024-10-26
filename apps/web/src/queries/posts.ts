import { createSupabaseBrowserClient } from "@/lib/supabase";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/router";

export const usePostsQuery = ({
  pageSize = 10,
}: { pageSize?: number } = {}) => {
  const sb = createSupabaseBrowserClient();
  const { query } = useRouter();
  const blogId = query.blogId || "";

  return useInfiniteQuery({
    queryKey: ["posts", blogId],
    enabled: !!blogId,
    initialPageParam: 0,
    getNextPageParam: (lastPage: any, pages: any) => {
      return lastPage?.length > 0 ? pages.length * pageSize : undefined;
    },
    queryFn: async ({ pageParam = 0 }) => {
      const { data, error } = await sb
        .from("posts_v5")
        .select("*")
        .eq("blog_id", blogId)
        .eq("deleted", false)
        .range(pageParam, pageParam + pageSize)
        .order("created_at", { ascending: false });

      return data;
    },
  });
};

export const usePostQuery = (postSlug: string, blogId: string) => {
  const sb = createSupabaseBrowserClient();

  return useQuery({
    queryKey: ["post", postSlug],
    queryFn: async () => {
      const { data, error } = await sb
        .from("posts")
        .select("*")
        .eq("slug", postSlug)
        .eq("blog_id", blogId)
        .single();

      if (error) {
        console.error(error);
        throw error;
      }

      const { data: tagsData, error: tagsError } = await sb
        .from("post_tags")
        .select("*")
        .eq("post_id", data.id);

      if (tagsError) {
        console.error(tagsError);
        throw tagsError;
      }

      return {
        data: {
          ...data,
          tags: tagsData,
        },
      };
    },
    enabled: !!postSlug,
  });
};

export const useUpdatePostTagsMutation = ({ blog_id }: { blog_id: string }) => {
  const sb = createSupabaseBrowserClient();
  const queryClient = useQueryClient();

  type UpdatePostTagsMutation = {
    postId: string;
    tags: string[];
  };

  return useMutation({
    mutationFn: async ({ postId, tags }: UpdatePostTagsMutation) => {
      // TO DO: move this to an rfc

      // first, delete all tags for this post
      const { data: deleteData, error: deleteError } = await sb
        .from("post_tags")
        .delete()
        .eq("post_id", postId);

      if (deleteError) {
        console.error(deleteError);
        throw deleteError;
      }

      const { data, error } = await sb.from("post_tags").upsert(
        tags.map((tag) => ({
          post_id: postId,
          tag_id: tag,
          blog_id,
        })),
        { onConflict: "post_id, tag_id, blog_id" }
      );

      if (error) {
        console.error(error);
        throw error;
      }

      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};
