import { useRouter } from "next/router";
import { ZendoEditor } from "@/components/Editor/ZendoEditor";
import { toast } from "sonner";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { useCategories } from "@/queries/categories";

export default function CreatePost() {
  const router = useRouter();
  const blogId = router.query.blogId as string;
  const supa = createSupabaseBrowserClient();

  return (
    <>
      <ZendoEditor
        autoCompleteSlug={true}
        tags={[]} // initial tags, none when creating a new post.
        onSave={async (content) => {
          const { tags, ...post } = content;
          try {
            console.log("category", post.category_id);
            if (post.category_id === 0) {
              // remove category_id from post
              post.category_id = null;
            }
            const { data, error } = await supa
              .from("posts")
              .insert({ ...post, blog_id: blogId })
              .select("slug, id")
              .single();

            if (error) {
              throw error;
            }

            if (content.tags) {
              const newTags = content.tags.map((tag) => ({
                tag_id: tag.id,
                blog_id: blogId,
                post_id: data.id,
              }));

              await supa.from("post_tags").insert(newTags);
            }
            if (content.published) {
              toast.success("Post published!");
              router.push(
                `/blogs/${blogId}/post/${data.slug}?pub=${content.published}`
              );
            } else {
              toast.success("Post saved!");
              const isPublished = content.published ? "?pub=true" : "";
              router.push(`/blogs/${blogId}/post/${data.slug + isPublished}`);
            }
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
    </>
  );
}
