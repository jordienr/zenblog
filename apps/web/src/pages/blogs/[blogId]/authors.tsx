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
import {
  useAuthors,
  useAuthorsQuery,
  useCreateAuthor,
  useDeleteAuthorMutation,
  useUpdateAuthorMutation,
} from "@/queries/authors";
import { MoreHorizontal, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function CreateAuthorDialog() {
  const createAuthor = useCreateAuthor();
  const blogId = useBlogId();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant={"outline"}>
          <Plus size={16} />
          <div>Create author</div>
        </Button>
      </DialogTrigger>
      <DialogContent className="!max-w-sm">
        <DialogHeader>
          <DialogTitle>Create author</DialogTitle>
        </DialogHeader>
        <form
          className="[&_input]:mb-3 [&_input]:mt-1"
          onSubmit={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const formData = new FormData(e.target as HTMLFormElement);
            const name = formData.get("name") as string;
            const slug = formData.get("slug") as string;

            try {
              await createAuthor.mutateAsync({
                name: name,
                slug: slug,
                blog_id: blogId,
              });
              toast.success("Author created");
              setOpen(false);
            } catch (error) {
              toast.error("Failed to create author. Email must be unique.");
            }
          }}
        >
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" placeholder="John Doe" />
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" placeholder="john-doe" />
          <div className="flex justify-end">
            <Button type="submit">Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function AuthorsPage() {
  const blogId = useBlogId();

  const { data: authors, isLoading } = useAuthorsQuery();
  const [selectedAuthor, setSelectedAuthor] = useState<{
    id: number;
    name: string;
    slug: string;
  } | null>(null);

  const [updateAuthorOpen, setUpdateAuthorOpen] = useState(false);
  const updateAuthor = useUpdateAuthorMutation();

  const [deleteAuthorOpen, setDeleteAuthorOpen] = useState(false);
  const deleteAuthor = useDeleteAuthorMutation(blogId);

  return (
    <AppLayout
      title="Authors"
      loading={isLoading}
      actions={<CreateAuthorDialog />}
    >
      <Section>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Author</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">
                <div className="sr-only">Action</div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {authors?.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="p-4 text-center">
                  No authors found
                </TableCell>
              </TableRow>
            )}
            {authors?.map((author) => (
              <TableRow key={author.id}>
                <TableCell>{author.name}</TableCell>
                <TableCell>{author.slug}</TableCell>
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
                          setSelectedAuthor(author);
                          setUpdateAuthorOpen(true);
                        }}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedAuthor(author);
                          setDeleteAuthorOpen(true);
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

        <Dialog open={updateAuthorOpen} onOpenChange={setUpdateAuthorOpen}>
          <DialogContent className="!max-w-sm">
            <DialogHeader>
              <DialogTitle>Edit author</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                const formData = new FormData(e.target as HTMLFormElement);
                const name = formData.get("name");
                const email = formData.get("email");
                if (!selectedAuthor?.id) return;

                // await updateAuthor.mutateAsync({
                //   id: selectedAuthor.author_id,
                //   name: name as string,
                //   email: email as string,
                // });

                toast.success("Author updated");
                setUpdateAuthorOpen(false);
              }}
            >
              <Label htmlFor="name">Name</Label>
              <Input
                defaultValue={selectedAuthor?.id ?? ""}
                id="name"
                name="name"
                placeholder="John Doe"
              />
              <Label className="mt-4" htmlFor="email">
                Email
              </Label>
              <Input
                defaultValue={selectedAuthor?.id ?? ""}
                id="email"
                name="email"
                placeholder="john@example.com"
                type="email"
              />
              <div className="mt-4 flex justify-end">
                <Button type="submit">Update</Button>
              </div>
            </form>
          </DialogContent>

          <ConfirmDialog
            open={deleteAuthorOpen}
            onOpenChange={setDeleteAuthorOpen}
            onConfirm={() => {
              if (!selectedAuthor?.id) return;
              deleteAuthor.mutate(selectedAuthor.id.toString());
              toast.success("Author deleted");
              setDeleteAuthorOpen(false);
            }}
          />
        </Dialog>
      </Section>
    </AppLayout>
  );
}

export default AuthorsPage;
