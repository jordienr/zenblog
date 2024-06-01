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
import { Fullscreen, Laptop, Maximize, Smartphone, Tablet } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const SCREEN_SIZES = {
  mobile: 320,
  tablet: 768,
  laptop: 1024,
};

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

  const publishedPosts = posts.data?.filter((post) => post.published);

  const [theme, setTheme] = useState(blog.data?.theme || "default");
  const [screenSize, setScreenSize] = useState<string | number>("100%");

  const isMobile = screenSize === SCREEN_SIZES.mobile;
  const isTablet = screenSize === SCREEN_SIZES.tablet;
  const isLaptop = screenSize === SCREEN_SIZES.laptop;

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
      <aside className="max-h-screen min-h-screen min-w-64 overflow-y-auto px-2">
        <div className="px-2 py-4">
          <Link href="/blogs">
            <ZendoLogo className="h-8 w-auto" />
          </Link>
        </div>

        <div className="mt-2 grid gap-2">
          <Label className="px-2">Theme</Label>
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

          <div className="actions">
            <Button
              size={"xs"}
              onClick={() => {
                updateBlog.mutate({
                  id: blogId as string,
                  theme,
                });
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </aside>
      <main className="max-h-screen min-h-screen flex-grow">
        <div className="h-full pr-4 pt-4">
          <div
            className="relative mx-auto h-full overflow-x-hidden rounded-t-lg border bg-white shadow-sm transition-all"
            style={{
              width: screenSize,
            }}
          >
            <div className="overflow-y-auto">
              <BlogHomePage
                blog={blog.data}
                posts={publishedPosts as Post[]}
                theme={theme as Theme}
                disableLinks
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
