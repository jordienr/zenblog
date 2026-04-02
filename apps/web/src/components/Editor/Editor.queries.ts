import { API } from "app/utils/api-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const api = API();

type UseTags = {
  blogId: string;
};
export const useBlogTags = ({ blogId }: UseTags) => {
  const hasBlogId = !!blogId && blogId !== "demo";

  const query = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const res = await api.v2.blogs[":blog_id"].tags.$get({
        param: { blog_id: blogId },
      });
      if (!res.ok) {
        throw new Error("Failed to load tags");
      }
      return (await res.json()) as Array<{
        id: string;
        name: string;
        slug: string;
      }>;
    },
    enabled: hasBlogId,
  });

  return query;
};

export const useCreateBlogTag = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (category: {
      name: string;
      slug: string;
      blog_id: string;
    }) => {
      const res = await api.v2.blogs[":blog_id"].tags.$post({
        param: { blog_id: category.blog_id },
        json: {
          name: category.name,
          slug: category.slug,
        },
      });
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      return (await res.json()) as {
        id: string;
        name: string;
        slug: string;
      };
    },
  });

  return mutation;
};
