import { Database } from "@/types/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API } from "app/utils/api-client";

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
      return [] as Array<{
        id: number;
        slug: string;
        name: string;
        bio: string | null;
        twitter: string | null;
        website: string | null;
      }>;
    },
  });
}

export function useAuthors({ blogId }: { blogId: string }) {
  return useQuery({
    queryKey: keys.authors,
    queryFn: async () => {
      const res = await api.v2.blogs[":blog_id"].authors.$get({
        param: { blog_id: blogId },
      });

      if (!res.ok) {
        throw new Error("Failed to load authors");
      }

      return (await res.json()) as Array<{
        id: number;
        slug: string;
        name: string;
        created_at: string;
        bio: string | null;
        twitter: string | null;
        website: string | null;
        image_url: string | null;
      }>;
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

  return useMutation({
    mutationFn: async (authorId: number) => {
      const res = await api.v2.blogs[":blog_id"].authors[":author_id"].$delete({
        param: {
          blog_id: blogId,
          author_id: String(authorId),
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete author");
      }

      return { error: null, data: await res.json() };
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
      const res = await api.v2.blogs[":blog_id"].posts[":post_id"].authors.$get({
        param: { blog_id: blogId, post_id: postId },
      });

      if (!res.ok) {
        throw new Error("Failed to load post authors");
      }

      return (await res.json()) as Array<{
        id: number;
        post_id: string;
        author_id: number;
        author: {
          name: string;
          slug: string;
          image_url: string | null;
        };
      }>;
    },
  });
}

export function useAddPostAuthorMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      post_id: string;
      author_id: number;
      blog_id: string;
    }) => {
      const res = await api.v2.blogs[":blog_id"].posts[":post_id"].authors.$post({
        param: {
          blog_id: payload.blog_id,
          post_id: payload.post_id,
        },
        json: {
          author_id: payload.author_id,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to add post author");
      }

      return { error: null, data: await res.json() };
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
      const blogId = window.location.pathname.split("/")[2] || "";
      const res = await api.v2.blogs[":blog_id"].posts[":post_id"].authors[
        ":author_id"
      ].$delete({
        param: {
          blog_id: blogId,
          post_id: payload.post_id,
          author_id: String(payload.author_id),
        },
      });

      if (!res.ok) {
        throw new Error("Failed to remove post author");
      }

      return { error: null, data: await res.json() };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: keys.postAuthors,
      });
    },
  });
}
