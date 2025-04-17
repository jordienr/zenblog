import { ConfirmDialog } from "@/components/confirm-dialog";
import { Media, ImageSelector } from "@/components/Images/ImagePicker";
import {
  useDeleteMediaMutation,
  useMediaQuery,
} from "@/components/Images/Images.queries";
import { ImageUploader } from "@/components/Images/ImageUploader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useBlogId } from "@/hooks/use-blog-id";
import AppLayout, { Section } from "@/layouts/AppLayout";
import { TrashIcon, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function MediaPage() {
  const blogId = useBlogId();
  const media = useMediaQuery(blogId, { enabled: true });
  const [selectedImages, setSelectedImages] = useState<Media[]>([]);
  const deleteMedia = useDeleteMediaMutation();
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  return (
    <AppLayout
      title="Media"
      description="Media you have uploaded in blog posts"
      loading={media.isLoading}
      actions={
        <div className="flex gap-2">
          {selectedImages.length > 0 && (
            <>
              <Button
                variant="destructive"
                onClick={() => {
                  setConfirmDeleteDialogOpen(true);
                }}
              >
                <TrashIcon size="16" />
                Delete {selectedImages.length}{" "}
                {selectedImages.length > 1 ? "files" : "file"}
              </Button>
              <ConfirmDialog
                open={confirmDeleteDialogOpen}
                onOpenChange={setConfirmDeleteDialogOpen}
                title="Are you sure you want to delete these files?"
                description={
                  <div className="mt-4 space-y-1 rounded-lg border border-yellow-300 bg-yellow-50 p-2">
                    <h2 className="font-bold text-yellow-700">Read this!</h2>
                    <p className="text-yellow-700">
                      If there are posts using this image, it will show a broken
                      image icon.
                      <br /> Make sure to update the posts to use a different
                      image first.
                    </p>
                  </div>
                }
                onConfirm={async () => {
                  const paths = selectedImages.map((img) => ({
                    path: `${blogId}/${img.name}`,
                    supabase_hosted: img.supabase_hosted,
                    blog_id: blogId,
                  }));
                  const res = await deleteMedia.mutateAsync(paths);

                  toast.success("Media deleted");
                  setConfirmDeleteDialogOpen(false);
                  setSelectedImages([]);
                }}
                dialogBody={
                  <div>
                    <h2 className="font-medium">Files to delete:</h2>
                    <pre className="grid max-h-48 max-w-full gap-2 overflow-x-auto overflow-y-auto rounded-md bg-slate-100 p-2 font-mono">
                      {selectedImages.map((img) => (
                        <code key={img.name}>{img.name}</code>
                      ))}
                    </pre>
                  </div>
                }
              />
            </>
          )}
          {/* <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload size="16" />
                Upload media
              </Button>
            </DialogTrigger>
            <DialogContent className="md:max-w-sm">
              <DialogTitle className="sr-only">Upload media</DialogTitle>
              <ImageUploader
                blogId={blogId}
                onSuccessfulUpload={() => {
                  setShowUploadDialog(false);
                  media.refetch();
                }}
              />
            </DialogContent>
          </Dialog> */}
        </div>
      }
    >
      <Section>
        {media.data?.length === 0 ? (
          <>
            <div className="p-12 py-32 text-center">
              <div className="text-2xl">📷</div>
              <div className="text-lg text-zinc-500">
                No images or videos uploaded yet
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-2 px-3 pt-1">
            <ImageSelector
              media={media.data || []}
              onChange={(imgs) => {
                setSelectedImages(imgs);
              }}
              selected={selectedImages}
              type="multiple"
            />
          </div>
        )}
      </Section>
    </AppLayout>
  );
}
