import { ConfirmDialog } from "@/components/confirm-dialog";
import { CreateTagDialog } from "@/components/Tags/CreateTagDialog";
import { UpdateTagDialog } from "@/components/Tags/UpdateTagDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useBlogId } from "@/hooks/use-blog-id";
import AppLayout, { Section } from "@/layouts/AppLayout";
import {
  useDeleteTagMutation,
  useTagsWithUsageQuery,
  useUpdateTagMutation,
} from "@/queries/tags";
import { MoreVertical, Pen, Trash } from "lucide-react";
import { useState } from "react";
import { PiTag } from "react-icons/pi";
import { toast } from "sonner";

export default function TagsPage() {
  const blogId = useBlogId();
  const tags = useTagsWithUsageQuery({ blogId }, { enabled: true });
  const [selectedTag, setSelectedTag] = useState<{
    tag_id: string | null;
    tag_name: string | null;
    slug: string | null;
  }>();
  const deleteTagMutation = useDeleteTagMutation(blogId);
  const updateTagMutation = useUpdateTagMutation(blogId);

  const [updateTagDialogOpen, setUpdateTagDialogOpen] = useState(false);
  const [deleteTagDialogOpen, setDeleteTagDialogOpen] = useState(false);

  return (
    <AppLayout
      title="Tags"
      actions={<CreateTagDialog blogId={blogId} />}
      description="Tags help you group your posts. Posts can have multiple tags."
      loading={tags.isLoading}
    >
      <Section>
        {tags.data?.length === 0 && (
          <div className="p-12 py-32 text-center">
            <div className="text-2xl">🏷️</div>
            <div className="text-lg text-zinc-500">Nothing here yet</div>
          </div>
        )}

        <div className="grid divide-y">
          {tags.data?.length ? (
            <div className="grid grid-cols-4 items-center p-2 text-sm font-medium text-zinc-600">
              <div>Tag</div>
              <div>Slug</div>
              <div className="text-right">Posts with tag</div>
              <div></div>
            </div>
          ) : null}

          {tags.data?.map((tag) => {
            return (
              <div
                key={tag.tag_id}
                className="grid grid-cols-4 items-center p-4 hover:bg-zinc-50"
              >
                <div className="flex items-center gap-2">
                  {/* <PiTag className="text-orange-500" size="16" /> */}
                  <span className="font-medium">{tag.tag_name}</span>
                </div>

                <div className="flex flex-col">
                  <p className="font-mono text-sm text-zinc-500">{tag.slug}</p>
                </div>

                <div className="text-right font-mono">{tag.post_count}</div>

                <div className="flex items-center justify-end">
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant={"ghost"}>
                        <MoreVertical size="16" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => {
                          if (!tag) {
                            return;
                          }
                          setSelectedTag(tag);
                          setUpdateTagDialogOpen(true);
                        }}
                      >
                        <Pen size="16" className="mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          if (!tag) {
                            return;
                          }
                          setSelectedTag(tag);
                          setDeleteTagDialogOpen(true);
                        }}
                      >
                        <Trash size="16" className="mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            );
          })}
        </div>
        <UpdateTagDialog
          tag={selectedTag}
          onSubmit={async (newTag) => {
            if (!newTag.tag_id) return;
            const res = await updateTagMutation.mutateAsync({
              name: newTag.tag_name,
              slug: newTag.slug,
              id: newTag.tag_id,
            });
            if (res.error) {
              toast.error("Failed to update tag");
              return;
            }
            setUpdateTagDialogOpen(false);
            toast.success("Tag updated");
          }}
          open={updateTagDialogOpen}
          onOpenChange={setUpdateTagDialogOpen}
        />
        <ConfirmDialog
          title="Delete tag"
          description="Are you sure you want to delete this tag? This action cannot be undone."
          open={deleteTagDialogOpen}
          onOpenChange={setDeleteTagDialogOpen}
          onConfirm={async () => {
            if (!selectedTag?.tag_id) return;

            const res = await deleteTagMutation.mutateAsync(selectedTag.tag_id);

            if (res.error) {
              toast.error("Failed to delete tag");
              return;
            }
            setDeleteTagDialogOpen(false);
            toast.success("Tag deleted");
          }}
        />
      </Section>
    </AppLayout>
  );
}
