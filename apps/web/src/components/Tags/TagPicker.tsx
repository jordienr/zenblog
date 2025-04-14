import { PropsWithChildren, useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { CreateTagForm } from "./CreateTagForm";

type Tag = {
  id: string;
  name: string;
  slug: string;
};

type Props = {
  allTags: Tag[];
  onChange: (tag: Tag[]) => void;
  selectedTags: Tag[];
  blogId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function TagPicker({
  allTags,
  onChange,
  selectedTags,
  children,
  blogId,
  open,
  onOpenChange,
}: PropsWithChildren<Props>) {
  const [showCreateTag, setShowCreateTag] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-[280px] rounded-xl p-1" align="start">
        <div className="flex w-full items-center justify-between pb-3">
          <h3 className="px-3 text-xs font-semibold">Tags</h3>
          <Button
            onClick={() => {
              setShowCreateTag(!showCreateTag);
            }}
            variant={"ghost"}
            className="px-2"
          >
            <Plus
              className={cn("transition-transform", {
                "rotate-45": showCreateTag,
              })}
            />
          </Button>
        </div>
        {showCreateTag ? (
          <>
            <CreateTagForm
              blogId={blogId}
              onSubmit={() => {
                setShowCreateTag(false);
              }}
            />
          </>
        ) : (
          <div className="flex flex-wrap gap-1">
            {allTags.length === 0 && (
              <p className="w-full p-4 text-center text-xs text-zinc-400">
                No tags yet
              </p>
            )}
            {allTags.map((tag) => {
              return (
                <button
                  key={tag.slug}
                  className={cn(
                    "rounded-full border border-zinc-200 bg-zinc-50 px-3 py-0.5 font-mono text-sm font-medium tracking-tight text-zinc-500 transition-all",
                    {
                      "border-orange-600 bg-orange-500 text-white":
                        selectedTags.includes(tag),
                    }
                  )}
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
              );
            })}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
