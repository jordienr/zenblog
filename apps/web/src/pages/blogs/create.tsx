import { EmojiPicker } from "@/components/EmojiPicker";
import AppLayout from "@/layouts/AppLayout";
import { generateSlug } from "@/lib/utils/slugs";
import { useCreateBlogMutation } from "@/queries/blogs";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useIsSubscribed, useSubscriptionQuery } from "@/queries/subscription";
import Link from "next/link";
import { StopCircle } from "lucide-react";
import { BsShieldX } from "react-icons/bs";

export default function CreateBlog() {
  const DEFAULT_EMOJI = "📝";
  const { width, height } = useWindowSize();

  const isSubscribed = useIsSubscribed();

  type FormData = {
    title: string;
    description?: string;
    emoji: string;
    slug: string;
  };
  const { register, handleSubmit, watch, setValue, control } =
    useForm<FormData>();

  const router = useRouter();
  const watchTitle = watch("title");

  useEffect(() => {
    if (watchTitle) {
      const slug = generateSlug(watchTitle);
      setValue("slug", slug);
    }
  }, [watchTitle, setValue]);

  const createBlog = useCreateBlogMutation();

  const onSubmit = async (data: FormData) => {
    const res = await createBlog.mutateAsync({
      title: data.title,
      description: data.description || "",
      emoji: data.emoji || DEFAULT_EMOJI,
      slug: data.slug,
    });

    if (res?.id) {
      router.push(`/blogs/${res.id}/posts`);
    }

    if (createBlog.isError) {
      console.error(createBlog.error);
      alert("Error creating blog, please try again");
    }
  };

  function NextActionItem({
    icon,
    children,
    onClick,
  }: {
    icon: string;
    children: React.ReactNode;
    onClick?: () => void;
  }) {
    return (
      <button
        onClick={onClick}
        className="group flex w-44 flex-col items-center gap-2 rounded-xl p-2 py-8 font-sans"
      >
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl border text-4xl shadow-sm transition-all group-hover:-translate-y-2">
          {icon}
        </span>
        <span className="font-medium group-hover:text-orange-500">
          {children}
        </span>
      </button>
    );
  }

  if (!isSubscribed) {
    return (
      <AppLayout>
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
        {/* {createBlog.isSuccess && (
          <div className="section">
            <Confetti width={width} height={height} />
            <div className="mt-8 text-center text-4xl font-semibold">🎉</div>
            <h2 className="mt-2">
              <span className="block text-center text-3xl font-semibold">
                You have created a blog!
              </span>
            </h2>
            <div className="text-center">
              <h2 className="text-xl text-slate-700">
                What do you want to do next?
              </h2>
              <div className="flex justify-center gap-4">
                <NextActionItem
                  onClick={() =>
                    router.push(`/blogs/${createBlog.data?.id}/create`)
                  }
                  icon="🧑‍🚀"
                >
                  Write my first post
                </NextActionItem>
                <NextActionItem
                  onClick={() =>
                    router.push(`/blogs/${createBlog.data?.id}/settings`)
                  }
                  icon="👩‍💻"
                >
                  Add it to my website
                </NextActionItem>
              </div>
            </div>
          </div>
        )} */}
        {!createBlog.isSuccess && (
          <div className="section p-4">
            <h1 className="mb-4 mt-1 text-center font-semibold">
              Create a blog
            </h1>
            <form
              className="flex flex-col gap-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="flex flex-col items-center gap-2">
                <Label htmlFor="emoji">
                  <span className="sr-only block">Emoji</span>
                  <Controller
                    control={control}
                    name="emoji"
                    defaultValue={DEFAULT_EMOJI}
                    render={({ field: { onChange, value } }) => (
                      <EmojiPicker onEmojiChange={onChange} emoji={value} />
                    )}
                  ></Controller>
                </Label>
                <div className="w-full">
                  <Label className="flex-grow" htmlFor="title">
                    Title
                  </Label>
                  <Input
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
                  <div className="flex font-mono tracking-tighter">
                    <span
                      contentEditable={true}
                      id="slug"
                      {...register("slug")}
                      className="rounded-md text-zinc-700 transition-all hover:bg-zinc-100"
                    >{`${watch("slug") || " "}`}</span>
                    <span>.zenblog.com</span>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="description">
                  Description{" "}
                  <span className="text-xs text-zinc-400">(optional)</span>{" "}
                </Label>
                <Input
                  type="text"
                  id="description"
                  {...register("description")}
                />
              </div>

              <Button type="submit">Create blog</Button>
            </form>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
