import AppLayout, {
  Section,
  SectionDescription,
  SectionTitle,
} from "@/layouts/AppLayout";
import { useRouter } from "next/router";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { EmojiPicker } from "@/components/EmojiPicker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  useBlogQuery,
  useDeleteBlogMutation,
  useUpdateBlogMutation,
} from "@/queries/blogs";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";

export default function BlogSettings() {
  type FormData = {
    title: string;
    description: string;
    emoji: string;
    slug: string;
  };

  const {
    register,
    handleSubmit,
    formState: { isDirty },
    reset,
    control,
  } = useForm<FormData>();
  const router = useRouter();
  const blogId = router.query.blogId as string;

  const {
    isLoading: blogLoading,
    data: blog,
    error: blogError,
    refetch: refetchBlog,
  } = useBlogQuery(blogId);

  const updateBlog = useUpdateBlogMutation();

  const onSubmit = handleSubmit(async (formData) => {
    try {
      console.log(formData);
      const res = await updateBlog.mutateAsync({ ...formData, id: blogId });
      toast.success("Blog updated successfully");

      reset(formData);
      refetchBlog();
    } catch (error) {
      console.error(error);
      alert("Error updating blog, please try again");
    }
  });

  const { mutateAsync: deleteBlogMutation } = useDeleteBlogMutation();

  async function deleteBlog() {
    await deleteBlogMutation(blogId);
    await router.push("/blogs");
  }

  async function onDeleteBlogClick() {
    const confirm1 = prompt(
      `To confirm you want to delete this blog, type "Delete ${blog?.title}"`
    );
    if (confirm1 === `Delete ${blog?.title}`) {
      if (
        confirm(
          "This action is irreversible. Are you sure you want to delete this blog?"
        )
      ) {
        await deleteBlog();
      }
    }
  }

  const [newAPIKey, setNewAPIKey] = useState("");
  const [showNewAPIKeyDialog, setShowNewAPIKeyDialog] = useState(false);

  if (blogLoading) {
    return <AppLayout loading={true}></AppLayout>;
  }

  if (blogError) {
    return <div>Error loading blog</div>;
  }

  if (!blog) {
    return <div>Blog not found</div>;
  }

  return (
    <AppLayout title="Settings">
      <div className="space-y-4">
        <Section>
          <div className="px-4">
            <form onSubmit={onSubmit} className="flex flex-col gap-2">
              <div className="flex items-end gap-4">
                <label htmlFor="emoji" title="Emoji">
                  <Controller
                    control={control}
                    name="emoji"
                    defaultValue={blog.emoji}
                    render={({ field: { onChange, value } }) => (
                      <EmojiPicker onEmojiChange={onChange} emoji={value} />
                    )}
                  ></Controller>
                </label>
                <div className="flex-grow">
                  <Label className="flex-grow" htmlFor="title">
                    Title
                  </Label>
                  <Input
                    type="text"
                    id="title"
                    className="flex w-full flex-grow"
                    required
                    {...register("title", {
                      value: blog.title,
                    })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  className="resize-none"
                  id="description"
                  {...register("description", {
                    value: blog.description || "",
                  })}
                />
              </div>

              <div className="actions mt-1">
                <Button type="submit">Save</Button>
              </div>
            </form>
          </div>
        </Section>

        <Section className="p-4">
          <h2 className="text-lg font-medium">Blog ID</h2>
          <p className="text-zinc-500">
            Use this ID to fetch your blogs content through the API.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <Input
              className="font-mono font-medium text-slate-900"
              value={blogId}
              readOnly
            />
            <Button
              variant={"outline"}
              onClick={() => {
                navigator.clipboard.writeText(blogId);
                toast.success("Blog ID copied to clipboard");
              }}
            >
              Copy
            </Button>
          </div>
          <Dialog open={showNewAPIKeyDialog}>
            <DialogContent className="flex max-w-sm flex-col gap-4">
              <DialogHeader>
                <DialogTitle>New API key</DialogTitle>
                <DialogDescription>
                  Make sure to save this key in a secure location. <br /> It
                  will not be shown again.{" "}
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center gap-2">
                <Input
                  value={newAPIKey}
                  readOnly
                  className="flex-grow font-mono"
                />
                <Button
                  variant={"outline"}
                  onClick={() => {
                    navigator.clipboard.writeText(newAPIKey || "");
                    toast.success("API key copied to clipboard");
                  }}
                >
                  Copy
                </Button>
              </div>

              <DialogFooter className="p-2">
                <Button onClick={() => setShowNewAPIKeyDialog(false)}>
                  I have saved the key securely
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Section>

        <Section className="p-4">
          <SectionTitle>Manage subscription</SectionTitle>
          <SectionDescription>
            You can manage your subscription from the account page.
          </SectionDescription>
          <div className="mt-4">
            <Link href="/account">
              <Button variant={"outline"}>Go to account</Button>
            </Link>
          </div>
        </Section>

        <div className="py-8 text-center text-zinc-400">~</div>

        <Section className="p-4">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-medium text-red-600">
            Danger zone
          </h2>
          <p className="text-zinc-500">
            This action cannot be undone. This will delete all posts in the
            blog.
          </p>
          <div className="actions">
            <Button
              onClick={onDeleteBlogClick}
              variant={"destructive"}
              className="mt-4"
            >
              Delete blog
            </Button>
          </div>
        </Section>
      </div>
    </AppLayout>
  );
}
