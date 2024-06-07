import Spinner from "@/components/Spinner";
import ZendoLogo from "@/components/ZendoLogo";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useBlogQuery, useUpdateBlogMutation } from "@/queries/blogs";
import { usePostsQuery } from "@/queries/posts";
import { BlogHomePage } from "app/pub/themes/blog-home";
import { Post, Theme } from "app/types";
import { THEMES } from "constants/themes";
import Link from "next/link";
import { useRouter } from "next/router";
import { PropsWithChildren, useEffect, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EmojiPicker } from "@/components/EmojiPicker";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";

function AccordionSettings({
  children,
  title,
}: PropsWithChildren<{ title: string }>) {
  return (
    <Accordion type="multiple" value={[title]}>
      <AccordionItem className="border-b transition-colors" value={title}>
        <AccordionTrigger className="p-2 pl-3 text-sm">
          {title}
        </AccordionTrigger>
        <AccordionContent className="px-2 pb-2">{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default function Customise() {
  const router = useRouter();
  const { blogId } = router.query;

  const blog = useBlogQuery(blogId as string);
  const posts = usePostsQuery();
  const updateBlog = useUpdateBlogMutation({
    onSuccess: () => {
      toast.success("Theme updated");
    },
  });

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
    getValues,
  } = useForm<FormData>();

  useEffect(() => {
    if (blog.data) {
      setTheme(blog.data.theme);
    }
  }, [blog.data]);

  const publishedPosts = posts.data?.filter((post) => post.published);

  const [theme, setTheme] = useState(blog.data?.theme);

  // RENDER

  if (blog.isError || posts.isError) {
    return <div>Error</div>;
  }

  if (!blog.data || !posts.data) {
    return <Spinner />;
  }

  if (blog.isLoading || posts.isLoading) {
    return <Spinner />;
  }

  return (
    <div className="flex min-h-screen bg-stone-50">
      <aside className="sticky top-0 max-h-screen min-h-screen min-w-72 overflow-y-auto">
        <div className="px-2 py-4">
          <Link href="/blogs">
            <ZendoLogo className="h-8 w-auto" />
          </Link>
        </div>

        <div className="">
          <AccordionSettings title="Blog">
            <div className="grid gap-4">
              <div className="flex items-center gap-2">
                <Controller
                  control={control}
                  name="emoji"
                  defaultValue={blog.data?.emoji}
                  render={({ field: { onChange, value } }) => (
                    <EmojiPicker onEmojiChange={onChange} emoji={value} />
                  )}
                ></Controller>
                <div className="flex-grow">
                  <Label className="mt-2">Title</Label>
                  <Input
                    {...register("title")}
                    defaultValue={blog.data?.title}
                  />
                </div>
              </div>

              <div>
                <Label className="mt-2">Description</Label>
                <Textarea
                  {...register("description")}
                  defaultValue={blog.data?.description}
                  className="resize-none"
                />
              </div>
            </div>
          </AccordionSettings>

          <AccordionSettings title="Theme">
            <div className="mt-2 grid gap-2">
              {THEMES.map((t) => (
                <button
                  onClick={() => {
                    setTheme(t.id);
                  }}
                  className={cn(
                    "rounded-lg border bg-white px-3 py-1.5 text-left text-sm hover:border-zinc-200",
                    {
                      "!border-orange-500": t.id === theme,
                    }
                  )}
                  key={t.id}
                >
                  <h3
                    className={cn("font-medium", {
                      "text-orange-500": t.id === theme,
                    })}
                  >
                    {t.name}
                  </h3>
                  <p className="text-xs text-zinc-400">{t.description}</p>
                </button>
              ))}
            </div>
          </AccordionSettings>
        </div>
        <div className="actions p-2">
          <Button
            size={"xs"}
            onClick={() => {
              const formVals = getValues();
              updateBlog.mutate({
                id: blogId as string,
                theme,
                ...formVals,
              });
            }}
          >
            Save
          </Button>
        </div>
      </aside>
      <main className="max-h-screen min-h-screen flex-grow pr-2 pt-2">
        <Tabs defaultValue="home" className="h-full">
          <TabsList className="py-0">
            <TabsTrigger
              className="border-none bg-none data-[state=active]:bg-transparent"
              value="home"
            >
              Home
            </TabsTrigger>
            <TabsTrigger
              className="border-none bg-none data-[state=active]:bg-transparent"
              value="post"
            >
              Post
            </TabsTrigger>
          </TabsList>
          <TabsContent className="mt-0 h-full" value="home">
            <motion.div
              key={theme}
              initial={{ filter: "blur(5px)" }}
              animate={{ filter: "blur(0px)" }}
              exit={{ filter: "blur(5px)" }}
              transition={{ duration: 0.5, ease: "linear" }}
              className="relative mx-auto h-full overflow-y-auto overflow-x-hidden rounded-t-lg border bg-white shadow-sm transition-all"
            >
              <BlogHomePage
                blog={blog.data}
                posts={publishedPosts as Post[]}
                theme={theme as Theme}
                disableLinks
              />
            </motion.div>
          </TabsContent>
          <TabsContent className="mt-0" value="post">
            Post
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
