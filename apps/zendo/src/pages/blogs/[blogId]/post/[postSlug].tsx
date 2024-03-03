import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAPIClient } from "@/lib/http/api";
import Spinner from "@/components/Spinner";
import { ZendoEditor } from "@/components/Editor/ZendoEditor";
import { toast } from "sonner";
import { useBlogTags } from "@/components/Editor/Editor.queries";
import { usePostQuery, useUpdatePostTagsMutation } from "@/queries/posts";

export default function Post() {
  const api = createAPIClient();
  const router = useRouter();
  const queryClient = useQueryClient();

  const blogId = router.query.blogId as string;
  const postSlug = router.query.postSlug as string;

  const { data: post, isLoading } = usePostQuery(postSlug);

  const tags = useBlogTags({ blogId });

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
  const updatePostTags = useUpdatePostTagsMutation({ blog_id: blogId });

  if (isLoading || tags.isLoading) {
    return (
      <div className="flex-center p-12">
        <Spinner />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex-center p-12">
        <h1>Post not found</h1>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <ZendoEditor
        onSave={async (data) => {
          try {
            // TO DO: move this to an rfc
            await updatePost.mutateAsync(data);
            await updatePostTags.mutateAsync({
              postId: post.id,
              tags: data.tags || [],
            });
            toast.success("Post saved!");
          } catch (error) {
            toast.error("Failed to save post");
            console.error(error);
          }
        }}
        post={post}
        tags={post.post_tags.map((tag) => String(tag.tag_id)) || []}
      />
    </div>
  );
}
