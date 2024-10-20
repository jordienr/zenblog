import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { useCategories, useCreateCategory } from "@/queries/categories";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function CreateCategoryDialog() {
  const createCategory = useCreateCategory();
  const blogId = useBlogId();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant={"outline"}>
          <Plus size={16} />
          <div>Create category</div>
        </Button>
      </DialogTrigger>
      <DialogContent className="!max-w-sm">
        <DialogHeader>
          <DialogTitle>Create category</DialogTitle>
        </DialogHeader>
        <form
          className="[&_input]:mb-3 [&_input]:mt-1"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const formData = new FormData(e.target as HTMLFormElement);
            const name = formData.get("name");
            const slug = formData.get("slug");
            createCategory.mutate({
              name: name as string,
              slug: slug as string,
              blog_id: blogId,
            });
            toast.success("Category created");
            setOpen(false);
          }}
        >
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" placeholder="Technology" />
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" placeholder="technology" />
          <div className="flex justify-end">
            <Button type="submit">Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function CategoriesPage() {
  const categories = useCategories();

  return (
    <AppLayout
      title="Categories"
      loading={categories.isLoading}
      actions={<CreateCategoryDialog />}
    >
      <Section>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Slug</TableHead>
              {/* <TableHead>Posts</TableHead> */}
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.data?.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.slug}</TableCell>
                {/* <TableCell>{category.post_count}</TableCell> */}
                <TableCell></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>
    </AppLayout>
  );
}
