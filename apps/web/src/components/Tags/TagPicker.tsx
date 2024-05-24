import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { PropsWithChildren, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { CreateTagDialog } from "./CreateTagDialog";
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
      <DropdownMenuContent className="w-[280px] p-2" align="start">
        <div className="flex w-full items-center justify-between pb-3">
          <h3 className="text-xs font-medium text-zinc-500">Tags</h3>
          <Button
            onClick={() => {
              setShowCreateTag(!showCreateTag);
            }}
            variant={"ghost"}
          >
            {showCreateTag ? "Tags" : "Create tag"}
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
              <p className="text-xs text-zinc-400">No tags found</p>
            )}
            {allTags.map((tag) => (
              <button
                key={tag.id}
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
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
