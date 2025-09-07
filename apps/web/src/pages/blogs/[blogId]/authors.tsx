/* eslint-disable @next/next/no-img-element */
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
import { cn } from "@/lib/utils";
import {
  Author,
  CreateAuthorInput,
  useAuthors,
  useCreateAuthor,
  useDeleteAuthorMutation,
  useUpdateAuthorMutation,
} from "@/queries/authors";
import { useSubscriptionQuery } from "@/queries/subscription";
import { useUserRole } from "@/queries/user-role";
import { slugify } from "app/utils/slugify";
import { MoreHorizontal, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const AuthorForm = ({
  onSubmit,
  author,
  isLoading,
}: {
  onSubmit: (data: CreateAuthorInput["form"]) => void;
  author?: Author;
  isLoading?: boolean;
}) => {
  const [name, setName] = useState(author?.name ?? "");
  const [slug, setSlug] = useState(author?.slug ?? "");

  useEffect(() => {
    const slug = slugify(name);
    setSlug(slug);
  }, [name]);

  return (
    <form
      className="[&_input]:mb-3 [&_input]:mt-1"
      onSubmit={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const formData = new FormData(e.target as HTMLFormElement);
        const image = formData.get("image") as File;

        onSubmit({
          name,
          slug,
          image: new File([image], image.name, {
            type: image.type,
          }),
          twitter: formData.get("twitter") as string,
          website: formData.get("website") as string,
          bio: formData.get("bio") as string,
        });
      }}
    >
      <div>
        <Label htmlFor="image">Image</Label>
        <Input
          id="image"
          name="image"
          type="file"
          required={!author} // only required if creating a new author
          accept="image/*"
        />
        <p className="-mt-2 px-2 text-xs text-gray-500">
          Recommended size is 400x400px
        </p>
      </div>
      <Label htmlFor="name">Name</Label>
      <Input
        id="name"
        name="name"
        placeholder="John Doe"
        onChange={(e) => setName(e.target.value)}
        value={name}
        required
      />
      <Label htmlFor="slug">Slug</Label>
      <Input
        id="slug"
        name="slug"
        placeholder="john-doe"
        value={slug}
        onChange={(e) => setSlug(e.target.value.replace(/ /g, "-"))}
        onBlur={(e) => setSlug(slugify(e.target.value))}
        required
      />
      <Label htmlFor="twitter">Twitter URL</Label>
      <Input
        id="twitter"
        name="twitter"
        placeholder="https://x.com/john_doe"
        type="url"
        defaultValue={author?.twitter ?? ""}
      />
      <Label htmlFor="website">Website URL</Label>
      <Input
        id="website"
        name="website"
        placeholder="https://john.doe"
        type="url"
        defaultValue={author?.website ?? ""}
      />
      <Label htmlFor="bio">Bio</Label>
      <Input
        id="bio"
        name="bio"
        placeholder="John Doe is a software engineer"
        defaultValue={author?.bio ?? ""}
      />
      <div className="flex justify-end">
        <Button type="submit" isLoading={isLoading}>
          {author ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
};

export function CreateAuthorDialog({
  hideTrigger,
  open,
  setOpen,
  disabled,
}: {
  hideTrigger?: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  disabled: boolean;
}) {
  const subscription = useSubscriptionQuery();
  const createAuthor = useCreateAuthor();
  const blogId = useBlogId();
  const { data: authors } = useAuthors({ blogId });

  const isFreePlan =
    subscription?.data?.plan === "free" ||
    !subscription?.data?.isValidSubscription;
  const hasReachedAuthorLimit = isFreePlan && authors?.length === 1;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!hideTrigger && (
        <DialogTrigger asChild>
          <Button
            size="sm"
            variant={"outline"}
            disabled={disabled}
            tooltip={
              disabled
                ? {
                    content: "Viewers cannot create authors",
                    side: "bottom",
                  }
                : undefined
            }
          >
            <Plus size={16} />
            <div>Create author</div>
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="!max-w-sm">
        <DialogHeader>
          <DialogTitle>Create author</DialogTitle>
        </DialogHeader>
        {hasReachedAuthorLimit ? (
          <>
            <p className="text-sm text-slate-500">
              You have reached the author limit for your plan. Please upgrade to
              create more authors.
            </p>
            <div className="flex justify-end">
              <Button asChild>
                <Link href="/account">Upgrade now</Link>
              </Button>
            </div>
          </>
        ) : (
          <AuthorForm
            isLoading={createAuthor.isPending}
            onSubmit={async (data) => {
              try {
                const res = await createAuthor.mutateAsync({
                  form: data,
                  param: {
                    blog_id: blogId,
                  },
                });
                if (!res.ok) {
                  console.error(res);
                  return;
                }
                toast.success("Author created");
                setOpen(false);
              } catch (error) {
                console.error(error);
                toast.error("Failed to create author.");
              }
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

export function UpdateAuthorDialog({
  author,
  open,
  onOpenChange,
}: {
  author?: Author;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const blogId = useBlogId();
  const updateAuthor = useUpdateAuthorMutation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit author</DialogTitle>
        </DialogHeader>
        <AuthorForm
          isLoading={updateAuthor.isPending}
          author={author}
          onSubmit={async (data) => {
            try {
              if (!author?.slug) return;

              const res = await updateAuthor.mutateAsync({
                form: {
                  name: data.name,
                  slug: data.slug,
                  image: data.image,
                  twitter: data.twitter,
                  website: data.website,
                  bio: data.bio,
                },
                param: {
                  blog_id: blogId,
                  author_slug: author.slug,
                },
              });

              if (!res.ok) {
                console.error(res);
                return;
              }

              toast.success("Author updated");
              onOpenChange(false);
            } catch (error) {
              console.error(error);
              toast.error("Failed to update author.");
            }
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

export function AuthorsPage() {
  const blogId = useBlogId();

  const { data: authors, isLoading } = useAuthors({ blogId });
  const [selectedAuthor, setSelectedAuthor] = useState<{
    id: number;
    name: string;
    slug: string;
  } | null>(null);

  const [updateAuthorOpen, setUpdateAuthorOpen] = useState(false);

  const [deleteAuthorOpen, setDeleteAuthorOpen] = useState(false);
  const deleteAuthor = useDeleteAuthorMutation(blogId);
  const { data: userRole } = useUserRole(blogId);

  const [createAuthorOpen, setCreateAuthorOpen] = useState(false);

  return (
    <AppLayout
      title="Authors"
      loading={isLoading}
      actions={
        <CreateAuthorDialog
          open={createAuthorOpen}
          setOpen={setCreateAuthorOpen}
          disabled={userRole === "viewer"}
        />
      }
    >
      <Section>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Bio</TableHead>
              <TableHead>Twitter</TableHead>
              <TableHead>Website</TableHead>

              <TableHead className="text-right">
                <div className="sr-only">Action</div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {authors?.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-8 text-center text-slate-500"
                >
                  No authors found
                </TableCell>
              </TableRow>
            )}
            {authors?.map((author) => (
              <TableRow key={author.id}>
                <TableCell>
                  {author.image_url ? (
                    <img
                      src={author.image_url}
                      alt={author.name}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-slate-200"></div>
                  )}
                </TableCell>
                <TableCell>{author.name}</TableCell>
                <TableCell>{author.slug}</TableCell>
                <TableCell className="truncate text-sm text-slate-500">
                  {author.bio}
                </TableCell>
                <TableCell className="truncate font-mono text-xs text-slate-500">
                  {author.twitter}
                </TableCell>
                <TableCell className="truncate font-mono text-xs text-slate-500">
                  {author.website}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn("", {
                          "pointer-events-none opacity-0":
                            userRole === "viewer",
                        })}
                      >
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedAuthor({
                            id: author.id,
                            name: author.name,
                            slug: author.slug,
                          });
                          setUpdateAuthorOpen(true);
                        }}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedAuthor({
                            id: author.id,
                            name: author.name,
                            slug: author.slug,
                          });
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

        <UpdateAuthorDialog
          author={authors?.find((a) => a.id === selectedAuthor?.id)}
          open={updateAuthorOpen}
          onOpenChange={setUpdateAuthorOpen}
        />

        <ConfirmDialog
          open={deleteAuthorOpen}
          onOpenChange={setDeleteAuthorOpen}
          onConfirm={async () => {
            if (!selectedAuthor?.id) return;
            await deleteAuthor.mutateAsync(selectedAuthor.id);
            toast.success("Author deleted");
            setDeleteAuthorOpen(false);
          }}
        />
      </Section>
    </AppLayout>
  );
}

export default AuthorsPage;
