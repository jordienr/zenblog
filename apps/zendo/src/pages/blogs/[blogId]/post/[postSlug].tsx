import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAPIClient } from "@/lib/http/api";
import Spinner from "@/components/Spinner";
import { ZendoEditor } from "@/components/Editor/ZendoEditor";
import { toast } from "sonner";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export default function Post() {
  const api = createAPIClient();
  const router = useRouter();
  const queryClient = useQueryClient();

  const blogId = router.query.blogId as string;
  const postSlug = router.query.postSlug as string;

  const { data: post, isLoading } = useQuery(
    ["posts", router.query.blogId, router.query.postSlug],
    () => api.posts.get(blogId, postSlug)
  );

  const updatePost = useMutation({
    mutationFn: (
      data: Partial<{
        title: string;
        published: boolean;
        slug: string;
        cover_image?: string;
        content?: any;
        metadata?: any;
      }>
    ) => api.posts.update(blogId, postSlug, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["posts", blogId, postSlug]);
    },
  });

  if (isLoading) {
    return (
      <div className="flex-center p-12">
        <Spinner />
      </div>
    );
  }
  return (
    <div className="flex min-h-screen w-full flex-col">
      <ZendoEditor
        onSave={async (content) => {
          try {
            console.log(content.metadata);
            await updatePost.mutateAsync(content);
            toast.success("Post saved!");
          } catch (error) {
            toast.error("Failed to save post");
            console.error(error);
          }
        }}
        post={post}
      />
    </div>
  );
}
