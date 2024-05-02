import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAPIClient } from "@/lib/http/api";
import Spinner from "@/components/Spinner";
import { ZendoEditor } from "@/components/Editor/ZendoEditor";
import { toast } from "sonner";
import { useBlogTags } from "@/components/Editor/Editor.queries";
import { usePostQuery } from "@/queries/posts";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { BsShieldX } from "react-icons/bs";
import { useState } from "react";
import { usePostTags } from "@/queries/tags";

export default function Post() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const blogId = router.query.blogId as string;
  const postSlug = router.query.postSlug as string;
  const hasPubQuery = router.query.pub as string;
  const [showPubDialog, setShowPubDialog] = useState(hasPubQuery);

  const sb = getSupabaseBrowserClient();

  const { data: post, isLoading, isRefetching } = usePostQuery(postSlug);

  const tagsQuery = usePostTags({ blogId, postId: post?.data?.id || "" });

  const tags = tagsQuery.data?.map((tagRes) => ({
    name: tagRes.blog_tags!.name,
    id: tagRes.blog_tags!.id,
    slug: tagRes.blog_tags!.slug,
  }));

  if (isLoading || tagsQuery.isLoading || isRefetching) {
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
    <div className="">
      <ZendoEditor
        onSave={async (data) => {
          console.log("Saved blog post", data);
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
        post={post.data}
        tags={tags || []}
      />

      {/* <Dialog open={showPubDialog} onOpenChange={setShowPubDialog}>
        <DialogContent>
          <div className="flex items-center gap-4">
            Congratulations! Your post is now live.
          </div>
        </DialogContent>
      </Dialog> */}
    </div>
  );
}
