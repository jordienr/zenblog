import { toast } from "sonner";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { useState } from "react";
import { Label } from "../ui/label";

type Props = {
  tag: {
    id: string;
    name: string;
    slug: string;
  };
  onSubmit: (tag: { name: string; slug: string }) => void;
  trigger: JSX.Element;
};
export function UpdateTagDialog({ onSubmit, tag, trigger }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <h2 className="font-medium">Edit tag</h2>
        <form
          className="mt-2 flex flex-col gap-2"
          onSubmit={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const target = e.target as HTMLFormElement;
            const formData = new FormData(target);
            const name = formData.get("name") as string;
            const slug = formData.get("slug") as string;
            if (!name || !slug) {
              toast.error("Name and slug are required");
              return;
            }
            onSubmit({ name, slug });
            formData.set("name", "");
            formData.set("slug", "");

            target.reset();
            toast.success("Tag updated");
            setOpen(false);
          }}
        >
          <Label>Name</Label>
          <Input name="name" required defaultValue={tag.name} />
          <Label>Slug</Label>
          <Input name="slug" required defaultValue={tag.slug} />
          <div className="flex items-center justify-end gap-2">
            <Button type="submit">Update</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
