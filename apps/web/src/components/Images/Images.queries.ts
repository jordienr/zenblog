import { getSupabaseBrowserClient } from "@/lib/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// export const useImages = (blogId: string) =>
//   useQuery({
//     queryKey: ["images", blogId],
//     queryFn: () => api.images.getAll(blogId),
//   });

export const useMediaQuery = (
  blogId: string,
  { enabled }: { enabled: boolean }
) => {
  const supa = getSupabaseBrowserClient();
  const query = useQuery({
    queryKey: ["media", blogId],
    queryFn: async () => {
      const res = await supa.storage.from("images").list(blogId);
      if (res.data) {
        const data = res.data.map((item) => {
          const itemUrlRes = supa.storage
            .from("images")
            .getPublicUrl(`${blogId}/${item.name}`);
          const itemUrl = itemUrlRes.data.publicUrl;
          const newItem = {
            ...item,
            url: itemUrl,
          };

          return newItem;
        });

        return data;
      }

      if (res.error) {
        throw new Error(res.error.message);
      }
    },
    enabled,
  });

  return query;
};

export function useUploadMediaMutation() {
  const supa = getSupabaseBrowserClient();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      path,
      fileBody,
    }: {
      path: string;
      fileBody: Blob;
    }) => {
      const res = await supa.storage.from("images").upload(path, fileBody);
      if (res.error) {
        throw new Error(res.error.message);
      }

      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
    },
  });

  return mutation;
}

export function useDeleteMediaMutation() {
  const supa = getSupabaseBrowserClient();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (paths: string[]) => {
      const res = await supa.storage.from("images").remove(paths);
      if (res.error) {
        throw new Error(res.error.message);
      }

      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
    },
  });

  return mutation;
}
