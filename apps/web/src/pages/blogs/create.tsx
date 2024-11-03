import AppLayout from "@/layouts/AppLayout";
import { generateSlug } from "@/lib/utils/slugs";
import { useBlogsQuery, useCreateBlogMutation } from "@/queries/blogs";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Smile } from "lucide-react";
import { RESERVED_SLUGS } from "@/lib/constants";
import { useSubscriptionQuery } from "@/queries/subscription";
import { SubscribeSection } from "../account";

export default function CreateBlog() {
  const DEFAULT_EMOJI = "📝";

  const { data: subscription, isLoading } = useSubscriptionQuery();

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

  const createBlog = useCreateBlogMutation();
  const blogsQuery = useBlogsQuery({ enabled: true });
  const totalBlogs = blogsQuery.data?.length || 0;

  const onSubmit = async (data: FormData) => {
    // validate slug is url friendly, allow only lowercase letters, numbers and hyphens
    // const regex = /^[a-zA-Z0-9-]+$/;
    // if (!regex.test(data.slug)) {
    //   toast.error(
    //     "Slug must be URL friendly. No special characters or spaces allowed."
    //   );
    //   return;
    // }

    // if (data.slug.length < 3) {
    //   toast.error("Slug must be at least 3 characters long");
    //   return;
    // }

    // if (RESERVED_SLUGS.includes(data.slug)) {
    //   toast.error(
    //     `${data.slug} slug is not available. Please choose another slug`
    //   );
    //   return;
    // }

    const res = await createBlog.mutateAsync({
      title: data.title,
      description: data.description || "",
      emoji: DEFAULT_EMOJI,
      // slug: data.slug,
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

  if (subscription?.plan === "free" && totalBlogs >= 1 && !isLoading) {
    return (
      <AppLayout loading={createBlog.isPending}>
        <div className="section mx-auto my-12 max-w-4xl px-4 py-12">
          <h2 className="mt-2">
            <div className="flex justify-center">
              <Smile size={32} className="mb-2 text-orange-500" />
            </div>
            <span className="block text-center text-lg font-semibold">
              The free plan can only create 1 blog
            </span>
          </h2>
          <div className="text-center">
            <p className="text-zinc-500">
              Subscribe to the Hobby or Pro plans to create more blogs.
            </p>
          </div>

          <SubscribeSection />
        </div>
      </AppLayout>
    );
  }

  if (subscription?.plan === "hobby" && totalBlogs >= 2) {
    return (
      <AppLayout loading={createBlog.isPending}>
        <div className="section mx-auto my-12 max-w-3xl px-4 py-12">
          <h2 className="mt-2">
            <div className="flex justify-center">
              <Smile size={32} className="mb-2 text-orange-500" />
            </div>
            <span className="block text-center text-lg font-semibold">
              The Hobby plan can only create 2 blogs
            </span>
          </h2>
          <div className="text-center">
            <p className="text-zinc-500">
              Subscribe to the Pro Plan to create more blogs.
            </p>
          </div>
          <SubscribeSection />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout loading={createBlog.isPending}>
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
              {/* <div className="w-full">
                <Label className="flex-grow" htmlFor="title">
                  <div className="sr-only">Slug</div>
                </Label>
                <div>
                  <Label htmlFor="slug-input">Slug</Label>
                  <Input
                    id="slug-input"
                    {...register("slug")}
                    className="overflow-hidden bg-transparent py-1 text-sm font-medium text-zinc-700 outline-none"
                  />
                  {watch("slug") && (
                    <div className="mt-2 rounded-md bg-zinc-100 px-2 py-1 font-mono tracking-tighter">
                      https://{watch("slug")}.zenblog.com
                    </div>
                  )}

                  {slug?.length >= 24 && (
                    <p>
                      <span className="text-xs text-red-500">
                        Slug is too long
                      </span>
                    </p>
                  )}
                </div>
              </div> */}
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
              {/* <p className="mt-1 text-xs">
                The description will be shown on the blog homepage.
              </p> */}
            </div>
            <Button type="submit">Create blog</Button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
