import { useRouter } from "next/router";
import { ZendoEditor } from "@/components/Editor/ZendoEditor";
import { toast } from "sonner";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export default function CreatePost() {
  const router = useRouter();
  const blogId = router.query.blogId as string;
  const supa = getSupabaseBrowserClient();

  return (
    <ZendoEditor
      tags={[]}
      onSave={async (content) => {
        const { tags, ...post } = content;
        try {
          const { data, error } = await supa
            .from("posts")
            .insert({ ...post, blog_id: blogId })
            .select("id")
            .single();

          if (error) {
            throw error;
          }

          if (content.tags) {
            content.tags.forEach((tag_id) => {
              supa
                .from("post_tags")
                .insert({ post_id: data.id, tag_id, blog_id: blogId });
            });
          }
          toast.success("Post saved!");
        } catch (error) {
          toast.error("Failed to save post");
          console.error(error);
          throw error;
        }
      }}
    />
  );
}
