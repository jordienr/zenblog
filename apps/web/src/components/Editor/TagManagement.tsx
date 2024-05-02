import React from "react";
import { useBlogTags, useCreateBlogTag } from "./Editor.queries";
import { useRouter } from "next/router";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Plus, Wand } from "lucide-react";
import { generateSlug } from "@/lib/utils/slugs";

type Tag = {
  id: string;
  name: string;
  slug: string;
};
type Props = {
  selectedTags: Tag[];
  onChange: (tags: Tag[]) => void;
};

export const TagManagement = (props: Props) => {
  const router = useRouter();
  const blogId = router.query.blogId as string;
  const tags = useBlogTags({ blogId });
  const createTag = useCreateBlogTag();

  const [title, setTitle] = React.useState("");
  const [slug, setSlug] = React.useState("");

  const [selectedTags, setSelectedTags] = React.useState<Tag[]>(
    props.selectedTags || []
  );

  const handleTagChange = (tags: Tag[]) => {
    setSelectedTags(tags);
    props.onChange(tags);
  };

  if (tags.isLoading) {
    return <></>;
  }

  return (
    <div>
      <div className="">
        <div className="flex items-center justify-between border-b pb-2">
          <h2 className="mb-0 font-mono">Tags</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                className="text-slate-500"
                variant={"ghost"}
                title="Create tag"
              >
                <Plus />
                <div>Create tag</div>
              </Button>
            </DialogTrigger>
            <DialogContent className="md:max-w-xs">
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
                  toast.success("Category created");
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
        </div>
        {tags.isLoading ? (
          <></>
        ) : (
          <div className="mt-2 grid grid-cols-3 gap-2">
            {tags.data?.map((tag) => (
              <label
                className="inline-flex items-center gap-1.5 rounded-lg border border-transparent px-2 py-1 transition-all hover:bg-zinc-100 has-[:checked]:border-orange-300 has-[:checked]:bg-orange-50"
                key={tag.id}
              >
                <input
                  onChange={(e) => {
                    if (e.target.checked) {
                      handleTagChange([...selectedTags, tag]);
                    } else {
                      handleTagChange(
                        selectedTags.filter((t) => t.id !== tag.id)
                      );
                    }
                  }}
                  checked={selectedTags.some((t) => t.id === tag.id)}
                  type="checkbox"
                  key={tag.id}
                  value={tag.id}
                />
                {tag.name}
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
