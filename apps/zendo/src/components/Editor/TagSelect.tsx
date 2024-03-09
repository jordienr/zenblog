import React from "react";
import { useBlogTags, useCreateBlogTag } from "./Editor.queries";
import { useRouter } from "next/router";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Plus } from "lucide-react";

type Props = {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
};

const TagSelect = (props: Props) => {
  const router = useRouter();
  const blogId = router.query.blogId as string;
  const tags = useBlogTags({ blogId });
  const createTag = useCreateBlogTag();

  const [selectedTags, setSelectedTags] = React.useState<string[]>(
    props.selectedTags || []
  );

  const handleTagChange = (tags: string[]) => {
    setSelectedTags(tags);
    props.onChange(tags);
  };

  if (tags.isLoading) {
    return <></>;
  }

  return (
    <div>
      <div>
        <div className="flex items-center justify-between border-b">
          <h2 className="mb-0 pb-2">Tags</h2>
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
                  toast.success("Category created");
                }}
              >
                <Input
                  autoComplete="off"
                  name="name"
                  type="text"
                  placeholder="Name"
                  required
                />
                <Input
                  autoComplete="off"
                  name="slug"
                  type="text"
                  placeholder="Slug"
                  required
                />
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
                className="inline-flex items-center gap-1 rounded-md p-1 hover:bg-zinc-100"
                key={tag.id}
              >
                <input
                  onChange={(e) => {
                    if (e.target.checked) {
                      handleTagChange([...selectedTags, e.target.value]);
                    } else {
                      handleTagChange(
                        selectedTags.filter((tag) => tag !== e.target.value)
                      );
                    }
                  }}
                  checked={selectedTags.includes(tag.id)}
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

export default TagSelect;
