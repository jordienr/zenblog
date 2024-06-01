import { EmojiPicker } from "@/components/EmojiPicker";
import AppLayout from "@/layouts/AppLayout";
import { generateSlug } from "@/lib/utils/slugs";
import { useCreateBlogMutation } from "@/queries/blogs";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useIsSubscribed } from "@/queries/subscription";
import Link from "next/link";
import { BsShieldX } from "react-icons/bs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function CreateBlog() {
  const DEFAULT_EMOJI = "📝";

  const isSubscribed = useIsSubscribed();

  type FormData = {
    title: string;
    description?: string;
    slug: string;
  };
  const { register, handleSubmit, watch, setValue, control, setError } =
    useForm<FormData>();

  const router = useRouter();
  const watchTitle = watch("title");
  const slug = watch("slug");

  useEffect(() => {
    if (watchTitle) {
      if (watchTitle.length >= 3) {
        const slug = generateSlug(watchTitle);
        setValue("slug", slug);
      }
    }
  }, [watchTitle, setValue]);

  useEffect(() => {
    const slugEl = document.getElementById("slug-input");
    if (!slugEl) return;

    if (slug?.length === 0) {
      slugEl.style.width = " 70px";
      return;
    }

    slugEl.style.width = `${slug?.length * 10}px`;
  }, [slug]);

  const createBlog = useCreateBlogMutation();

  const onSubmit = async (data: FormData) => {
    if (!isSubscribed) {
      return;
    }

    if (data.slug.length < 3 && data.slug.length > 24) {
      toast.error("Slug must be at least 3 characters long");
      return;
    }

    const res = await createBlog.mutateAsync({
      title: data.title,
      description: data.description || "",
      emoji: DEFAULT_EMOJI,
      slug: data.slug,
    });

    if (res.error) {
      if (res.error.code === "23505") {
        toast.error("Slug already exists. Please choose another slug");
        document.getElementById("slug-input")?.focus();
        return;
      }
    }

    if (res?.data?.id) {
      router.push(`/blogs/${res.data.id}/posts`);
    }

    if (createBlog.isError) {
      console.error(createBlog.error);
      alert("Error creating blog, please try again");
    }
  };

  if (!isSubscribed) {
    return (
      <AppLayout loading={createBlog.isPending}>
        <div className="section mx-auto my-12 max-w-xl py-12">
          <div className="text-center text-4xl">
            <BsShieldX className="mx-auto text-red-500" size="48" />
          </div>
          <h2 className="mt-2">
            <span className="block text-center text-3xl font-semibold">
              You are not subscribed to a plan
            </span>
          </h2>
          <div className="text-center">
            <p className="text-xl text-zinc-500">
              Please subscribe to a plan to create more blogs.
            </p>
          </div>
          <div className="mt-8 text-center">
            <Button asChild>
              <Link href="/account">Subscribe to a plan</Link>
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-md pt-12">
        <div className="section p-4">
          <h1 className="mb-4 mt-1 text-lg font-medium">Create a blog</h1>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col items-center gap-2">
              <div className="w-full">
                <Label className="flex-grow" htmlFor="title">
                  Title
                </Label>
                <Input
                  tabIndex={0}
                  placeholder="My blog"
                  type="text"
                  id="title"
                  required
                  {...register("title")}
                />
              </div>
              <div className="w-full">
                <Label className="flex-grow" htmlFor="title">
                  <div className="sr-only">Slug</div>
                </Label>
                <div>
                  <div className="flex font-mono tracking-tighter">
                    <textarea
                      id="slug-input"
                      placeholder="my-blog"
                      style={{ resize: "none" }}
                      {...register("slug")}
                      rows={1}
                      cols={24}
                      className="min-w-4 max-w-48 overflow-hidden rounded-md bg-transparent py-1 pl-1 pr-0.5 text-right text-sm font-medium text-zinc-700 outline-none hover:bg-zinc-100 focus:bg-zinc-100"
                    />
                    <span className="flex-grow py-1 text-sm">.zenblog.com</span>
                  </div>
                  {slug?.length >= 24 && (
                    <p>
                      <span className="text-xs text-red-500">
                        Slug is too long
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="description">
                Description{" "}
                <span className="text-xs text-zinc-400">(optional)</span>{" "}
              </Label>
              <Textarea
                id="description"
                className="resize-none"
                {...register("description")}
                placeholder="A blog about my thoughts"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                  }
                }}
              />
              <p className="mt-1 text-xs">
                The description will be shown on the blog homepage.
              </p>
            </div>
            <Button type="submit">Create blog</Button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
