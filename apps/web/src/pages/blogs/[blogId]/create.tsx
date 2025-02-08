import { useRouter } from "next/router";
import { ZendoEditor } from "@/components/Editor/ZendoEditor";
import { toast } from "sonner";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { useState } from "react";

export default function CreatePost() {
  const router = useRouter();
  const blogId = router.query.blogId as string;
  const supa = createSupabaseBrowserClient();
  const [loading, setLoading] = useState(false);

  return (
    <>
      <ZendoEditor
        autoCompleteSlug={true}
        tags={[]} // initial tags, none when creating a new post.
        loading={loading}
        onSave={async (content) => {
          setLoading(true);
          const { tags, authors, ...post } = content;
          try {
            if (post.category_id === 0) {
              // remove category_id from post
              post.category_id = null;
            }

            // Create post and get the result
            const { data: newPost, error: postError } = await supa
              .from("posts")
              .insert({ ...post, blog_id: blogId })
              .select("slug, id")
              .single();

            if (postError) throw postError;

            // If there are tags, create the associations and wait for completion
            if (tags && tags.length > 0) {
              const newTags = tags.map((tag) => ({
                tag_id: tag.id,
                blog_id: blogId,
                post_id: newPost.id,
              }));

              const { error: tagError } = await supa
                .from("post_tags")
                .insert(newTags);

              if (tagError) throw tagError;
            }

            if (authors && authors.length > 0) {
              const { error: authorError } = await supa
                .from("post_authors")
                .insert(
                  authors.map((author) => ({
                    author_id: author,
                    post_id: newPost.id,
                    blog_id: blogId,
                  }))
                );

              if (authorError) throw authorError;
            }

            // Only redirect after both operations complete successfully
            if (content.published) {
              toast.success("Post published!");
              router.push(
                `/blogs/${blogId}/post/${newPost.slug}?pub=${content.published}`
              );
            } else {
              router.push(`/blogs/${blogId}/post/${newPost.slug}`);
              toast.success("Post saved!");
            }
          } catch (error: any) {
            console.error(error);
            if (error?.code === "23505") {
              toast.error("A post with that slug already exists");
              return;
            }
            toast.error("Failed to save post");
          } finally {
            setLoading(false);
          }
        }}
      />
    </>
  );
}
