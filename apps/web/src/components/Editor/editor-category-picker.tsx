import { Category } from "@zenblog/types";
import Spinner from "../Spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CreateCategoryDialog } from "@/pages/blogs/[blogId]/categories";
import { useState } from "react";

export function EditorCategoryPicker({
  isLoading,
  categories,
  onChange,
  value,
}: {
  isLoading: boolean;
  categories: {
    id: number;
    name: string;
    slug: string;
  }[];
  onChange: (value: number | null) => void;
  value: number | null;
}) {
  const [open, setOpen] = useState(false);
  const hasCategory = value !== null;
  const selectedCategory = categories.find((c) => c.id === value);
  return (
    <>
      <CreateCategoryDialog open={open} setOpen={setOpen} />
      {isLoading ? (
        <div className="flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <DropdownMenu modal={false}>
          <div className="flex items-center">
            <DropdownMenuTrigger className="w-full py-1 pl-3 pr-1 text-left">
              {hasCategory ? selectedCategory?.name : "Select a category"}
            </DropdownMenuTrigger>
            {hasCategory && (
              <button
                className="p-1 text-zinc-500 hover:text-zinc-700"
                onClick={() => onChange(null)}
              >
                <X size={15} />
              </button>
            )}
          </div>
          <DropdownMenuContent className="w-80" align="start">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="flex items-center justify-between p-0 pl-2 text-xs">
                Categories
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(true)}
                >
                  <Plus />
                </Button>
              </DropdownMenuLabel>
              {categories?.map((category) => (
                <DropdownMenuItem
                  className={cn(
                    value === category.id && "bg-zinc-100 text-orange-500"
                  )}
                  key={category.id + "-category"}
                  onClick={() => onChange(category.id)}
                >
                  {category.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}
