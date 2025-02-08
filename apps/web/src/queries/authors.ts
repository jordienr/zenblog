import { createSupabaseBrowserClient } from "@/lib/supabase";
import { Database } from "@/types/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API } from "app/utils/api-client";

const sb = createSupabaseBrowserClient();

export type Author = Omit<
  Database["public"]["Tables"]["authors"]["Row"],
  "id" | "created_at" | "updated_at" | "blog_id"
>;

const keys = {
  authors: ["blog-authors"],
  postAuthors: ["blog-post-authors"],
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
  });
}

export function useAuthors({ blogId }: { blogId: string }) {
  return useQuery({
    queryKey: keys.authors,
    queryFn: async () => {
      const { data, error } = await sb
        .from("authors")
        .select("id, slug, name, created_at, bio, twitter, website, image_url")
        .eq("blog_id", blogId)
        .throwOnError();

      if (error) {
        throw error;
      }
      return data;
    },
  });
}

const api = API();
const createAuthor = api.v2.blogs[":blog_id"].authors.$post;
export type CreateAuthorInput = Parameters<typeof createAuthor>[0];

export function useCreateAuthor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (author: CreateAuthorInput) => await createAuthor(author),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.authors });
    },
  });
}

export function useDeleteAuthorMutation(blogId: string) {
  const queryClient = useQueryClient();
  const supa = createSupabaseBrowserClient();

  return useMutation({
    mutationFn: async (authorId: number) => {
      const res = await supa
        .from("authors")
        .delete()
        .eq("blog_id", blogId)
        .eq("id", authorId)
        .throwOnError();

      if (res.error) {
        console.log(res.error);
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

  return useMutation({
    mutationFn: async (payload: {
      form: CreateAuthorInput["form"];
      param: { blog_id: string; author_slug: string };
    }) => {
      const res = await api.v2.blogs[":blog_id"].authors[":author_slug"].$patch(
        {
          form: payload.form,
          param: {
            blog_id: payload.param.blog_id,
            author_slug: payload.param.author_slug,
          },
        }
      );

      if (!res.ok) {
        throw new Error(res.statusText);
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

export function usePostAuthorsQuery({
  postId,
  blogId,
}: {
  postId: string;
  blogId: string;
}) {
  return useQuery({
    queryKey: keys.postAuthors,
    enabled: !!postId && !!blogId,
    queryFn: async () => {
      const { data } = await sb
        .from("post_authors")
        .select(
          `
          id,
          post_id,
          author_id,
          author:authors(name, slug, image_url)
        `
        )
        .eq("post_id", postId)
        .eq("blog_id", blogId);

      console.log("🥬 AUTHORS---", data);
      return data;
    },
  });
}

export function useAddPostAuthorMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { post_id: string; author_id: number }) => {
      const res = await sb.from("post_authors").insert({
        post_id: payload.post_id,
        author_id: payload.author_id,
      });
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: keys.postAuthors,
      });
    },
  });
}

export function useRemovePostAuthorMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { post_id: string; author_id: number }) => {
      const res = await sb
        .from("post_authors")
        .delete()
        .eq("post_id", payload.post_id)
        .eq("author_id", payload.author_id);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: keys.postAuthors,
      });
    },
  });
}
