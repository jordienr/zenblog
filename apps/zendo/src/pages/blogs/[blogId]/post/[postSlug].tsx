import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAPIClient } from "@/lib/http/api";
import Spinner from "@/components/Spinner";
import { ZendoEditor } from "@/components/Editor/ZendoEditor";
import { toast } from "sonner";
import { useBlogTags } from "@/components/Editor/Editor.queries";
import { usePostQuery } from "@/queries/posts";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export default function Post() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const blogId = router.query.blogId as string;
  const postSlug = router.query.postSlug as string;

  const sb = getSupabaseBrowserClient();

  const { data: post, isLoading, isRefetching } = usePostQuery(postSlug);

  const tags = useBlogTags({ blogId });

  if (isLoading || tags.isLoading || isRefetching) {
    return (
      <div className="flex-center p-12">
        <Spinner />
      </div>
    );
  }

  if (!post) {
    router.push(`/blogs/${blogId}/posts`);
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
          const { tags, ...newData } = data;
          try {
            // TO DO: move this to an rfc
            const { data: res, error } = await sb
              .from("posts")
              .update(newData)
              .eq("slug", postSlug)
              .select()
              .single();

            if (error) {
              throw error;
            }

            const newTags = data?.tags?.map((tag: string) => ({
              tag_id: tag,
              blog_id: blogId,
              post_id: post.id,
            }));

            if (newTags) {
              await sb.from("post_tags").upsert(newTags, {
                onConflict: "tag_id, post_id, blog_id",
              });
            }

            queryClient.invalidateQueries([
              "posts",
              "post",
              blogId,
              postSlug,
              "tags",
            ]);

            queryClient.refetchQueries(["posts", "post", blogId, postSlug]);

            toast.success("Post saved!");
            // Redirect in case the slug changed
            router.push(`/blogs/${blogId}/post/${data.slug}`);
          } catch (error: any) {
            console.error(error);
            if (error?.code === "23505") {
              toast.error("A post with that slug already exists");
              return;
            }
            toast.error("Failed to save post");
          }
        }}
        post={post}
        tags={post.post_tags.map((tag) => String(tag.tag_id)) || []}
      />
    </div>
  );
}
