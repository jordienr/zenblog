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
