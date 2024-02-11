import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { ZendoEditor } from "@/components/Editor/ZendoEditor";
import { toast } from "sonner";

export default function CreatePost() {
  const router = useRouter();
  const blogId = router.query.blogId as string;
  const supa = useSupabaseClient();

  return (
    <ZendoEditor
      onSave={async (content) => {
        try {
          await supa.from("posts").insert({ ...content, blog_id: blogId });
          toast.success("Post saved!");
        } catch (error) {
          toast.error("Failed to save post");
          console.error(error);
        }
      }}
    />
  );
}
