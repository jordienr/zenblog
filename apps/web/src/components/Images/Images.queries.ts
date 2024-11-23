import { createSupabaseBrowserClient } from "@/lib/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API } from "app/utils/api-client";
import { Airplay } from "lucide-react";

// export const useImages = (blogId: string) =>
//   useQuery({
//     queryKey: ["images", blogId],
//     queryFn: () => api.images.getAll(blogId),
//   });

export const useMediaQuery = (
  blogId: string,
  { enabled }: { enabled: boolean }
) => {
  const supa = createSupabaseBrowserClient();
  const query = useQuery({
    queryKey: ["media", blogId],
    queryFn: async () => {
      const { data: blogImages } = await supa
        .from("blog_images")
        .select("file_url, file_name, created_at")
        .eq("blog_id", blogId);

      const res = await supa.storage.from("images").list(blogId, {
        sortBy: {
          column: "created_at",
          order: "desc",
        },
      });
      if (res.data) {
        const data = res.data.map((item) => {
          const itemUrlRes = supa.storage
            .from("images")
            .getPublicUrl(`${blogId}/${item.name}`);
          const itemUrl = itemUrlRes.data.publicUrl;
          const newItem = {
            ...item,
            url: itemUrl,
            supabase_hosted: true,
          };

          return newItem;
        });

        type Image = {
          id: string;
          url: string;
          name: string;
          created_at: string;
        };

        const formattedBlogImages = blogImages?.map((image) => ({
          ...image,
          id: image.file_url,
          url: image.file_url,
          name: image.file_name,
        }));

        const allImages: Image[] = [...data, ...(formattedBlogImages || [])];

        return allImages.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
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
  const supa = createSupabaseBrowserClient();
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
  const supa = createSupabaseBrowserClient();
  const queryClient = useQueryClient();
  const api = API();

  const mutation = useMutation({
    mutationFn: async (
      items: {
        path: string;
        supabase_hosted?: boolean;
        blog_id: string;
      }[]
    ) => {
      // Split items into Supabase and R2 hosted images
      const supabaseItems = items
        .filter((item) => item.supabase_hosted)
        .map((item) => item.path);

      const r2Items = items.filter((item) => !item.supabase_hosted);

      // Handle Supabase deletions
      if (supabaseItems.length > 0) {
        const res = await supa.storage.from("images").remove(supabaseItems);
        if (res.error) {
          throw new Error(res.error.message);
        }
      }

      // Handle R2/Cloudflare deletions
      for (const item of r2Items) {
        console.log("item", item);
        const file_name = item.path.split("/").pop();
        console.log("file_name", file_name);
        if (!item.blog_id || !file_name) {
          throw new Error("Blog ID is required");
        }
        const res = await api.v2.blogs[":blog_id"].images[":file_name"].$delete(
          {
            param: {
              blog_id: item.blog_id,
              file_name,
            },
          }
        );

        if (res.status !== 200) {
          const error = await res.json();
          console.error(error);
          throw new Error("Failed to delete image");
        }

        return;
      }

      return { message: "Successfully deleted images" };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
    },
  });

  return mutation;
}
