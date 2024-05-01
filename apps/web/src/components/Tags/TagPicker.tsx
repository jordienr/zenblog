import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { PropsWithChildren } from "react";

type Tag = {
  id: string;
  name: string;
  slug: string;
};

type Props = {
  allTags: Tag[];
  onChange: (tag: Tag[]) => void;
  selectedTags: Tag[];
};

export function TagPicker({
  allTags,
  onChange,
  selectedTags,
  children,
}: PropsWithChildren<Props>) {
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <h2 className="font-medium">Select tags</h2>
        <div className="grid grid-cols-3 gap-2">
          {allTags.map((tag) => (
            <button
              key={tag.id}
              className={`${
                selectedTags.includes(tag) ? "bg-slate-100" : ""
              } rounded-md p-2`}
              onClick={() => {
                if (selectedTags.includes(tag)) {
                  onChange(selectedTags.filter((t) => t.id !== tag.id));
                } else {
                  onChange([...selectedTags, tag]);
                }
              }}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
