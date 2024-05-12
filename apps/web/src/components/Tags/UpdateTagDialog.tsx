import { toast } from "sonner";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useState } from "react";

type Props = {
  tag:
    | {
        tag_id: string | null;
        tag_name: string | null;
        slug: string | null;
      }
    | undefined;
  onSubmit: (tag: { tag_name: string; slug: string; tag_id: string }) => void;
  open: boolean;
  onOpenChange: (value: boolean) => void;
};
export function UpdateTagDialog({ onSubmit, tag, open, onOpenChange }: Props) {
  const [newTitle, setNewTitle] = useState(tag?.tag_name || "");
  const [newSlug, setNewSlug] = useState(tag?.slug || "");

  useEffect(() => {
    setNewTitle(tag?.tag_name || "");
    setNewSlug(tag?.slug || "");
  }, [tag]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-sm">
        <h2 className="font-medium">Edit tag</h2>
        <form
          className="mt-2 flex flex-col gap-2"
          onSubmit={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!tag?.tag_id) {
              return;
            }
            onSubmit({
              tag_name: newTitle,
              slug: newSlug,
              tag_id: tag?.tag_id,
            });

            setNewTitle("");
            setNewSlug("");
          }}
        >
          <Label>Name</Label>
          <Input
            name="tag_name"
            required
            onChange={(e) => {
              setNewTitle(e.target.value);
            }}
            value={newTitle}
          />
          <Label>Slug</Label>
          <Input
            name="slug"
            required
            value={newSlug}
            onChange={(e) => {
              // if the user writes a space, we should replace it with a dash
              const value = e.target.value.replace(/\s/g, "-");
              setNewSlug(value);
            }}
          />
          <div className="flex items-center justify-end gap-2">
            <Button type="submit">Update</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
