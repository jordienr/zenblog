import { ConfirmDialog } from "@/components/confirm-dialog";
import { Image, ImageSelector } from "@/components/Images/ImagePicker";
import {
  useDeleteMediaMutation,
  useMediaQuery,
} from "@/components/Images/Images.queries";
import { ImageUploader } from "@/components/Images/ImageUploader";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useBlogId } from "@/hooks/use-blog-id";
import AppLayout, { Section } from "@/layouts/AppLayout";
import { TrashIcon, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function MediaPage() {
  const blogId = useBlogId();
  const media = useMediaQuery(blogId, { enabled: true });
  const [selectedImages, setSelectedImages] = useState<Image[]>([]);
  const deleteMedia = useDeleteMediaMutation();
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  return (
    <AppLayout
      title="Media"
      loading={media.isLoading}
      actions={
        <div className="flex gap-2">
          {selectedImages.length > 0 && (
            <>
              <Button
                variant="outline"
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
                description="Blog posts that reference these files will be affected. This action cannot be undone."
                onConfirm={async () => {
                  const paths = selectedImages.map(
                    (img) => `${blogId}/${img.name}`
                  );
                  const { error, data } = await deleteMedia.mutateAsync(paths);

                  if (error) {
                    toast.error("Failed to delete images");
                    return;
                  }
                  toast.success("Images deleted");
                  setSelectedImages([]);
                }}
                dialogBody={
                  <div>
                    <h2 className="font-medium">Files to delete:</h2>
                    <ul className="font-mono text-red-500">
                      {selectedImages.map((img) => (
                        <li key={img.name}>{img.name}</li>
                      ))}
                    </ul>
                  </div>
                }
              />
            </>
          )}
          <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
            <DialogTrigger asChild>
              <Button variant="ghost">
                <Upload size="16" />
                Upload
              </Button>
            </DialogTrigger>
            <DialogContent className="md:max-w-sm">
              <ImageUploader
                blogId={blogId}
                onSuccessfulUpload={() => {
                  setShowUploadDialog(false);
                  media.refetch();
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      }
    >
      <Section>
        {media.data?.length === 0 ? (
          <>
            <div className="p-12 py-32 text-center">
              <div className="text-2xl">📷</div>
              <div className="text-lg text-zinc-500">
                No images uploaded yet
              </div>
            </div>
          </>
        ) : (
          <div className="mt-3 flex flex-col gap-2 px-3">
            <ImageSelector
              images={media.data || []}
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
