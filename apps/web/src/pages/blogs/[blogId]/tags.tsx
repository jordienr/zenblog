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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useBlogId } from "@/hooks/use-blog-id";
import AppLayout, { Section } from "@/layouts/AppLayout";
import {
  useDeleteTagMutation,
  useTagsWithUsageQuery,
  useUpdateTagMutation,
} from "@/queries/tags";
import { MoreHorizontal, MoreVertical, Pen, Trash } from "lucide-react";
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
      description="Posts can have multiple tags."
      loading={tags.isLoading}
    >
      <Section>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tag</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="text-right">Posts with tag</TableHead>
              <TableHead className="text-right">
                <div className="sr-only">Action</div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tags.data?.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center font-mono text-slate-500"
                >
                  No tags found
                </TableCell>
              </TableRow>
            )}
            {tags.data?.map((tag) => (
              <TableRow key={tag.tag_id}>
                <TableCell>{tag.tag_name}</TableCell>
                <TableCell className="font-mono text-slate-500">
                  {tag.slug}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {tag.post_count}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant={"ghost"}>
                        <MoreHorizontal size="16" />
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
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

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
