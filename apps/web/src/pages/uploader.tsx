import { ImageUploader } from "@/components/Images/ImageUploader";
import { useBlogId } from "@/hooks/use-blog-id";

export default function Uploader() {
  const blogId = useBlogId();

  return (
    <div className="flex-x-center flex-y-center py-24">
      <ImageUploader blogId={blogId} />
    </div>
  );
}
