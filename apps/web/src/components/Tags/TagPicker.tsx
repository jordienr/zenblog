import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { PropsWithChildren } from "react";
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
};

export function TagPicker({
  allTags,
  onChange,
  selectedTags,
  children,
  blogId,
}: PropsWithChildren<Props>) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-sm md:max-w-sm">
        <h2 className="font-medium">Select tags</h2>
        {/* <Popover>
          <PopoverTrigger>pick tags</PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search tags" />
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {allTags.map((tag) => (
                  <CommandItem
                    key={tag.id}
                    value={tag.name}
                    onSelect={() => {
                      if (selectedTags.includes(tag)) {
                        onChange(selectedTags.filter((t) => t.id !== tag.id));
                      } else {
                        onChange([...selectedTags, tag]);
                      }
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedTags.find((t) => tag.id === t.id)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {tag.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover> */}

        <div className="flex flex-wrap gap-1">
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
          <div className="flex w-full justify-end">
            <CreateTagDialog blogId={blogId} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
