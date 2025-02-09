import AppLayout from "@/layouts/AppLayout";
import { generateSlug } from "@/lib/utils/slugs";
import { useBlogsQuery, useCreateBlogMutation } from "@/queries/blogs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
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
  const { register, handleSubmit } = useForm<FormData>();

  const router = useRouter();

  const createBlog = useCreateBlogMutation();
  const blogsQuery = useBlogsQuery({ enabled: true });
  const totalBlogs = blogsQuery.data?.length || 0;

  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    const res = await createBlog.mutateAsync({
      title: data.title,
      description: data.description || "",
      emoji: DEFAULT_EMOJI,
    });

    if (res.error) {
      if (res.error.code === "23505") {
        toast.error("Slug already exists. Please choose another slug");
        document.getElementById("slug-input")?.focus();
        return;
      }
    }

    if (res?.data?.id) {
      await router.push(`/blogs/${res.data.id}/posts`);
    }

    setSubmitting(false);

    if (createBlog.isError) {
      console.error(createBlog.error);
      alert("Error creating blog, please try again");
    }
  };

  if (isLoading || createBlog.isPending || submitting) {
    return <AppLayout loading={true} />;
  }

  if (
    (subscription?.plan === "free" || !subscription?.isValidSubscription) &&
    totalBlogs >= 1
  ) {
    return (
      <AppLayout loading={createBlog.isPending || submitting}>
        <div className="section mx-auto my-12 max-w-4xl px-4 py-12">
          <h2 className="mt-2">
            <div className="flex justify-center">
              <Smile size={24} className="mb-2 text-orange-500" />
            </div>
            <span className="block text-center text-lg font-semibold">
              You have reached the blog limit for your plan.
            </span>
          </h2>
          <div className="text-center">
            <p className="text-zinc-500">
              Update your plan to create more blogs.
            </p>
          </div>
          <hr className="my-8" />
          <div className="mt-8">
            <SubscribeSection />
          </div>
        </div>
      </AppLayout>
    );
  }

  if (
    subscription?.plan === "hobby" &&
    subscription?.isValidSubscription &&
    totalBlogs >= 2
  ) {
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
            </div>
            <Button type="submit">Create blog</Button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
