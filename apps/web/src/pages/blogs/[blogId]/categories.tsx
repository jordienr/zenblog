import { ConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useBlogId } from "@/hooks/use-blog-id";
import AppLayout, { Section } from "@/layouts/AppLayout";
import { generateSlug } from "@/lib/utils/slugs";
import {
  useCategoriesWithPostCount,
  useCreateCategory,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} from "@/queries/categories";
import { MoreHorizontal, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function CreateCategoryDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const createCategory = useCreateCategory();
  const blogId = useBlogId();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  useEffect(() => {
    setSlug(generateSlug(name));
  }, [name]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="!max-w-sm">
        <DialogHeader>
          <DialogTitle>Create category</DialogTitle>
        </DialogHeader>
        <form
          className="[&_input]:mb-3 [&_input]:mt-1"
          onSubmit={async (e) => {
            e.preventDefault();
            e.stopPropagation();

            try {
              await createCategory.mutateAsync({
                name,
                slug,
                blog_id: blogId,
              });
              toast.success("Category created");
              setOpen(false);
            } catch (error) {
              toast.error("Failed to create category. Slugs must be unique.");
            }
          }}
        >
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Technology"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            name="slug"
            className="disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!name}
            placeholder="technology"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
          <div className="flex justify-end">
            <Button type="submit">Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function CategoriesPage() {
  const blogId = useBlogId();

  const { data: categories, isLoading } = useCategoriesWithPostCount(blogId);
  const [selectedCategory, setSelectedCategory] = useState<{
    category_id: number | null;
    category_name: string | null;
    category_slug: string | null;
  } | null>(null);

  const [updateCategoryOpen, setUpdateCategoryOpen] = useState(false);
  const updateCategory = useUpdateCategoryMutation();

  const [deleteCategoryOpen, setDeleteCategoryOpen] = useState(false);
  const deleteCategory = useDeleteCategoryMutation(blogId);
  const [open, setOpen] = useState(false);
  return (
    <AppLayout
      title="Categories"
      loading={isLoading}
      actions={
        <Button size="sm" variant={"outline"} onClick={() => setOpen(true)}>
          <Plus size={16} />
          <div>Create category</div>
        </Button>
      }
      description="Posts can have one category."
    >
      <CreateCategoryDialog open={open} setOpen={setOpen} />
      <Section>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="text-right">Posts with category</TableHead>
              <TableHead className="text-right">
                <div className="sr-only">Action</div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories?.data?.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center font-mono text-slate-500"
                >
                  No categories found
                </TableCell>
              </TableRow>
            )}
            {categories?.data?.map((category) => (
              <TableRow key={category.category_id}>
                <TableCell className="font-medium">
                  {category.category_name}
                </TableCell>
                <TableCell className="font-mono text-slate-500">
                  {category.category_slug}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {category.post_count}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedCategory(category);
                          setUpdateCategoryOpen(true);
                        }}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedCategory(category);
                          setDeleteCategoryOpen(true);
                        }}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={updateCategoryOpen} onOpenChange={setUpdateCategoryOpen}>
          <DialogContent className="!max-w-sm">
            <DialogHeader>
              <DialogTitle>Edit category</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                const formData = new FormData(e.target as HTMLFormElement);
                const name = formData.get("name");
                const slug = formData.get("slug");
                if (!selectedCategory?.category_id) return;

                await updateCategory.mutateAsync({
                  id: selectedCategory.category_id,
                  name: name as string,
                  slug: slug as string,
                });

                toast.success("Category updated");
                setUpdateCategoryOpen(false);
              }}
            >
              <Label htmlFor="name">Name</Label>
              <Input
                defaultValue={selectedCategory?.category_name ?? ""}
                id="name"
                name="name"
                placeholder="Technology"
              />
              <Label className="mt-4" htmlFor="slug">
                Slug
              </Label>
              <Input
                defaultValue={selectedCategory?.category_slug ?? ""}
                id="slug"
                name="slug"
                placeholder="technology"
              />
              <div className="mt-4 flex justify-end">
                <Button type="submit">Update</Button>
              </div>
            </form>
          </DialogContent>

          <ConfirmDialog
            open={deleteCategoryOpen}
            onOpenChange={setDeleteCategoryOpen}
            onConfirm={() => {
              if (!selectedCategory?.category_id) return;
              deleteCategory.mutate(selectedCategory.category_id.toString());
              toast.success("Category deleted");
              setDeleteCategoryOpen(false);
            }}
          />
        </Dialog>
      </Section>
    </AppLayout>
  );
}
