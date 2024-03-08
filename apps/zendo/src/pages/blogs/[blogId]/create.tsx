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
      autoCompleteSlug={true}
      tags={[]} // initial tags, none when creating a new post.
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
            const newTags = content.tags.map((tag: string) => ({
              tag_id: tag,
              blog_id: blogId,
              post_id: data.id,
            }));

            await supa.from("post_tags").insert(newTags);
          }
          toast.success("Post saved!");
        } catch (error: any) {
          console.error(error);
          if (error?.code === "23505") {
            toast.error("A post with that slug already exists");
            return;
          }
          toast.error("Failed to save post");
        }
      }}
    />
  );
}
