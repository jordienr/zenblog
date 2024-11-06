import Spinner from "@/components/Spinner";
import { ZendoLogo } from "@/components/ZendoLogo";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useBlogQuery, useUpdateBlogMutation } from "@/queries/blogs";
import { usePostsQuery } from "@/queries/posts";
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
import { Controller, useForm } from "react-hook-form";
import { Laptop, Smartphone, Tablet } from "lucide-react";

function AccordionSettings({
  children,
  title,
}: PropsWithChildren<{ title: string }>) {
  return (
    <Accordion type="multiple" defaultValue={[title]}>
      <AccordionItem className="border-b transition-colors" value={title}>
        <AccordionTrigger className="p-2 pl-3 text-sm">
          {title}
        </AccordionTrigger>
        <AccordionContent className="px-3 pb-6">{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default function Customise() {
  const router = useRouter();
  const { blogId } = router.query;
  const [previewWidth, setPreviewWidth] = useState<string | number>("100%");

  const blog = useBlogQuery(blogId as string);
  const posts = usePostsQuery();
  const updateBlog = useUpdateBlogMutation({
    onSuccess: () => {
      toast.success("Blog updated");
    },
  });

  type FormData = {
    title: string;
    description: string;
    emoji: string;
    slug: string;
    twitter: string;
    instagram: string;
    website: string;
  };

  const { register, control, getValues, watch, reset } = useForm<FormData>({
    defaultValues: {
      title: blog.data?.title,
      description: blog.data?.description,
      emoji: blog.data?.emoji,
      slug: blog.data?.slug || "",
      twitter: blog.data?.twitter,
      instagram: blog.data?.instagram,
      website: blog.data?.website,
    },
  });

  useEffect(() => {
    // Workaround for form not updating on first render
    if (blog.data) {
      reset({
        title: blog.data.title,
        description: blog.data.description,
        emoji: blog.data.emoji,
        slug: blog.data.slug || "",
        twitter: blog.data.twitter,
        instagram: blog.data.instagram,
        website: blog.data.website,
      });
    }
  }, [blog.data, reset]);

  const vals = watch();

  useEffect(() => {
    if (blog.data) {
      setTheme(blog.data.theme);
    }
  }, [blog.data]);

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
      <aside className="sticky top-0 max-h-screen min-h-screen min-w-72 overflow-y-auto border-r">
        <div className="px-2 py-4">
          <Link href="/blogs">
            <ZendoLogo className="h-8 w-auto" />
          </Link>
        </div>

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
                <Input {...register("title")} defaultValue={blog.data?.title} />
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

        <AccordionSettings title="Social links">
          <div className="grid gap-4 [&_input]:font-mono [&_input]:text-xs">
            <div>
              <Label className="mt-2">Website</Label>
              <Input
                {...register("website")}
                defaultValue={blog.data?.website}
                placeholder="https://example.com"
              />
            </div>
            <div>
              <Label className="mt-2">Twitter</Label>
              <Input
                {...register("twitter")}
                defaultValue={blog.data?.twitter}
                placeholder="https://x.com/username"
              />
            </div>
            <div>
              <Label className="mt-2">Instagram</Label>
              <Input
                {...register("instagram")}
                defaultValue={blog.data?.instagram}
                placeholder="https://instagram.com/username"
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

        <div className="actions p-2">
          <Button
            size={"xs"}
            variant={"ghost"}
            onClick={() => {
              setTheme(blog.data?.theme);
              reset();
            }}
          >
            Reset
          </Button>
          <Button
            size={"xs"}
            onClick={() => {
              const vals = getValues();

              console.log(theme, vals);

              const data = {
                id: blogId as string,
                theme,
                ...vals,
              };

              updateBlog.mutate(data);
            }}
          >
            Save
          </Button>
        </div>
      </aside>
      <main className="max-h-screen min-h-screen flex-grow px-2 pt-2">
        <Tabs defaultValue="home" className="h-full">
          <TabsList className="flex py-0">
            <TabsTrigger
              className="border-none bg-none data-[state=active]:bg-transparent"
              value="home"
            >
              Home
            </TabsTrigger>
            {/* <TabsTrigger
              className="border-none bg-none data-[state=active]:bg-transparent"
              value="post"
            >
              Post
            </TabsTrigger> */}
            <div className="ml-auto">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setPreviewWidth(360)}
              >
                <Smartphone />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setPreviewWidth(641)}
              >
                <Tablet />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setPreviewWidth("100%")}
              >
                <Laptop />
              </Button>
            </div>
          </TabsList>
          <TabsContent className="mt-0" value="home">
            <motion.div
              key={theme}
              initial={{ filter: "blur(5px)" }}
              animate={{ filter: "blur(0px)" }}
              exit={{ filter: "blur(5px)" }}
              transition={{ duration: 0.5, ease: "linear" }}
              className="relative mx-auto flex-grow overflow-y-auto overflow-x-hidden rounded-t-lg border bg-white shadow-sm transition-all"
              style={{
                maxWidth: previewWidth,
                height: "calc(100vh - 3rem)",
              }}
            >
              <iframe
                src={`/blogs/${blogId}/customise-preview?theme=${theme}&title=${vals.title}&description=${vals.description}&emoji=${vals.emoji}&slug=${vals.slug}&twitter=${vals.twitter}&instagram=${vals.instagram}&website=${vals.website}`}
                className="h-full w-full"
              ></iframe>
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
