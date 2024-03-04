import { getSupabaseBrowserClient } from "@/lib/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";

export const usePostsQuery = () => {
  const sb = getSupabaseBrowserClient();
  const { query } = useRouter();
  const blogId = query.blogId || "";

  return useQuery({
    queryKey: ["posts", blogId],
    enabled: !!blogId,
    queryFn: async () => {
      const { data, error } = await sb
        .from("posts_with_tags")
        .select("*")
        .eq("blog_id", blogId)
        .eq("deleted", false)
        .limit(50)
        .order("created_at", { ascending: false });

      return data;
    },
  });
};

export const usePostQuery = (postSlug: string) => {
  const sb = getSupabaseBrowserClient();

  return useQuery({
    queryKey: ["post", postSlug],
    queryFn: async () => {
      const { data, error } = await sb
        .from("posts")
        .select("*, post_tags(*)")
        .eq("slug", postSlug)
        .single();

      return data;
    },
    enabled: !!postSlug,
  });
};

export const useUpdatePostTagsMutation = ({ blog_id }: { blog_id: string }) => {
  const sb = getSupabaseBrowserClient();
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

      queryClient.invalidateQueries(["posts"]);
    },
  });
};
