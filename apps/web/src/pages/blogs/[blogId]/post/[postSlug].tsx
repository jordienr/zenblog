import { useRouter } from "next/router";
import { useQueryClient } from "@tanstack/react-query";
import { ZendoEditor } from "@/components/Editor/ZendoEditor";
import { toast } from "sonner";
import { usePostQuery } from "@/queries/posts";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { usePostTags } from "@/queries/tags";
import { Loader2 } from "lucide-react";

export default function Post() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const blogId = router.query.blogId as string;
  const postSlug = router.query.postSlug as string;

  const sb = createSupabaseBrowserClient();

  const {
    data: post,
    isLoading,
    isRefetching,
  } = usePostQuery(postSlug, blogId);

  const tagsQuery = usePostTags({
    blog_id: blogId,
    post_id: post?.data?.id || "",
  });

  const tags = tagsQuery.data?.map((t) => t.tags);

  const filteredTags = tags?.filter((t) => t !== null) || [];

  if (isLoading || tagsQuery.isLoading || isRefetching) {
    return (
      <div className="flex-center p-32">
        <Loader2 className="animate-spin text-orange-500" size={32} />
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
    <div className="">
      <ZendoEditor
        onSave={async (data) => {
          const { tags, ...newData } = data;
          try {
            // TO DO: move this to an rfc
            const { error } = await sb
              .from("posts")
              .update(newData)
              .eq("slug", postSlug)
              .select();

            if (error) {
              throw error;
            }

            const newTags = data?.tags?.map((tag) => ({
              tag_id: tag.id,
              blog_id: blogId,
              post_id: post.data.id,
            }));

            if (newTags) {
              await sb
                .from("post_tags")
                .delete()
                .match({ post_id: post.data.id, blog_id: blogId });
              await sb.from("post_tags").upsert(newTags, {
                onConflict: "tag_id, post_id, blog_id",
              });
            }

            queryClient.invalidateQueries({
              queryKey: ["posts", "post", blogId, postSlug, "tags"],
            });

            queryClient.refetchQueries({
              queryKey: ["posts", "post", blogId, postSlug],
            });

            toast.success("Post saved!");
            // Redirect in case the slug changed
            const isPublished = data.published ? "?pub=true" : "";
            router.push(`/blogs/${blogId}/post/${data.slug + isPublished}`);
          } catch (error: any) {
            console.error(error);
            if (error?.code === "23505") {
              toast.error("A post with that slug already exists");
              return;
            }
            toast.error("Failed to save post");
          }
        }}
        post={post.data}
        tags={filteredTags as any} // typescript cant infer properly, breaks build.
      />
    </div>
  );
}
