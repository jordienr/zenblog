import { createSupabaseBrowserClient } from "@/lib/supabase";
import { Database } from "@/types/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const sb = createSupabaseBrowserClient();

export type Author = Database["public"]["Tables"]["authors"]["Row"];

<<<<<<< HEAD
export function useAuthorsWithPostCount() {
  return useQuery({
    queryKey: ["authors-with-post-count"],
    queryFn: async () => [],
    //   await sb
    //     .from("author_post_count")
    //     .select(
    //       "author_id, author_name, author_slug, post_count, created_at"
    //     )
    //     .throwOnError(),
=======
const keys = {
  authors: ["blog-authors"],
};

export function useAuthorsQuery() {
  return useQuery({
    queryKey: keys.authors,
    queryFn: async () => {
      const { data } = await sb
        .from("authors")
        .select("id, slug, name, bio, twitter, website")
        .throwOnError();
      return data;
    },
>>>>>>> 98a92c6 (wip)
  });
}

export function useAuthors() {
  return useQuery({
    queryKey: keys.authors,
    queryFn: async () => {
      const { data, error } = await sb
        .from("authors")
        .select("id, slug, name, created_at, bio, twitter, website")
        .throwOnError();
      if (error) {
        throw error;
      }
      return data;
    },
  });
}

export function useCreateAuthor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (author: Omit<Author, "id" | "created_at">) =>
      await sb.from("authors").insert(author).throwOnError(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.authors });
    },
  });
}

export function useDeleteAuthorMutation(blogId: string) {
  const queryClient = useQueryClient();
  const supa = createSupabaseBrowserClient();

  return useMutation({
    mutationFn: async (authorId: string) => {
      const res = await supa
        .from("authors")
        .delete()
        .eq("id", authorId)
        .eq("blog_id", blogId);

      if (res.error) {
        throw new Error(res.error.message);
      }

      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: keys.authors,
      });
    },
  });
}

export function useUpdateAuthorMutation() {
  const queryClient = useQueryClient();
  const supa = createSupabaseBrowserClient();

  return useMutation({
    mutationFn: async (author: { id: number; name: string; slug: string }) => {
      const res = await supa.from("authors").update(author).eq("id", author.id);

      if (res.error) {
        throw new Error(res.error.message);
      }

      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: keys.authors,
      });
    },
  });
}
