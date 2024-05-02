import { toast } from "sonner";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type Props = {
  tag: {
    tag_id: string | null;
    tag_name: string | null;
    slug: string | null;
  };
  onSubmit: (tag: { tag_name: string; slug: string }) => void;
  open: boolean;
  onOpenChange: (value: boolean) => void;
};
export function UpdateTagDialog({ onSubmit, tag, open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-sm">
        <h2 className="font-medium">Edit tag</h2>
        <form
          className="mt-2 flex flex-col gap-2"
          onSubmit={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const target = e.target as HTMLFormElement;
            const formData = new FormData(target);
            const tag_name = formData.get("tag_name") as string;
            const slug = formData.get("slug") as string;
            if (!tag_name || !slug) {
              toast.error("Name and slug are required");
              return;
            }
            onSubmit({ tag_name, slug });
            formData.set("name", "");
            formData.set("slug", "");

            target.reset();
            toast.success("Tag updated");
          }}
        >
          <Label>Name</Label>
          <Input name="tag_name" required defaultValue={tag.tag_name!} />
          <Label>Slug</Label>
          <Input name="slug" required defaultValue={tag.slug!} />
          <div className="flex items-center justify-end gap-2">
            <Button type="submit">Update</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
