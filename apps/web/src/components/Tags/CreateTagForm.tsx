import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { generateSlug } from "@/lib/utils/slugs";
import { useState } from "react";
import { useCreateBlogTag } from "../Editor/Editor.queries";

export const CreateTagForm = ({
  blogId,
  onSubmit,
}: {
  blogId: string;
  onSubmit: () => void;
}) => {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const createTag = useCreateBlogTag();

  return (
    <>
      <form
        className="flex flex-col gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          e.stopPropagation();

          if (!name || !slug) {
            toast.error("Name and slug are required");
            return;
          }
          await createTag.mutateAsync({ name, slug, blog_id: blogId });

          toast.success("Tag created");
          onSubmit();
        }}
      >
        <Input
          autoComplete="off"
          name="name"
          type="text"
          placeholder="Name"
          required
          value={name}
          onChange={(e) => {
            setName(e.target.value);
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
    </>
  );
};
