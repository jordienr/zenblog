import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/router";
import { API } from "app/utils/api-client";
import { createSupabaseBrowserClient } from "@/lib/supabase";

export const usePostsQuery = ({
  pageSize = 10,
  sortBy = "created",
}: { pageSize?: number; sortBy?: "created" | "published" } = {}) => {
  const api = API();
  const { query } = useRouter();
  const blogId = (query.blogId as string) || "";

  return useInfiniteQuery({
    queryKey: ["posts", blogId, sortBy, pageSize],
    enabled: !!blogId,
    initialPageParam: 1,
    getNextPageParam: (lastPage: any, allPages: any, pageParam: any) => {
      if (Array.isArray(lastPage) && lastPage.length === pageSize) {
        return pageParam + 1;
      }
      return undefined;
    },
    queryFn: async ({ pageParam = 1 }) => {
      const res = await api.v2.blogs[":blog_id"].posts.$get({
        param: { blog_id: blogId },
        query: {
          page: pageParam.toString(),
          page_size: pageSize.toString(),
          sort_by: sortBy,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch posts");
      }

      const { data, error } = await res.json();

      if (error) {
        throw new Error(error);
      }

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
