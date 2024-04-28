import { PropsWithChildren, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useCreateBlogTag } from "../Editor/Editor.queries";
import { Input } from "../ui/input";
import { generateSlug } from "@/lib/utils/slugs";

type Props = {
  blogId: string;
};
export function CreateTagDialog({ blogId }: PropsWithChildren<Props>) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");

  useEffect(() => {
    setSlug(generateSlug(title));
  }, [title]);

  const createTag = useCreateBlogTag();

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className="text-slate-500"
            variant={"secondary"}
            title="Create tag"
          >
            <Plus />
            <div>Create tag</div>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-xs">
          <h2 className="font-medium">Create tag</h2>
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
              await createTag.mutateAsync({ name, slug, blog_id: blogId });
              formData.set("name", "");
              formData.set("slug", "");

              target.reset();
              toast.success("Tag created");
              setOpen(false);
            }}
          >
            <Input
              autoComplete="off"
              name="name"
              type="text"
              placeholder="Name"
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setSlug(generateSlug(e.target.value));
              }}
            />
            <div className="flex items-center gap-1">
              <Input
                autoComplete="off"
                name="slug"
                type="text"
                className="font-mono"
                placeholder="Slug"
                required
                value={slug}
                onChange={(e) => {
                  // if the user writes a space, we should replace it with a dash
                  const value = e.target.value.replace(/\s/g, "-");
                  setSlug(value);
                }}
              />
            </div>

            <Button type="submit">Create Tag</Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
