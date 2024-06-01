import Spinner from "@/components/Spinner";
import ZendoLogo from "@/components/ZendoLogo";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useBlogQuery } from "@/queries/blogs";
import { usePostsQuery } from "@/queries/posts";
import { BlogHomePage } from "app/pub/themes/blog-home";
import { Post, Theme } from "app/types";
import { THEMES } from "constants/themes";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Customise() {
  const router = useRouter();
  const { blogId } = router.query;

  const blog = useBlogQuery(blogId as string);
  const posts = usePostsQuery();

  const publishedPosts = posts.data?.filter((post) => post.published);

  const [theme, setTheme] = useState("directory");

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
          {/* <Label>Theme</Label>
          <Select onValueChange={setTheme} value={theme}>
            <SelectTrigger className="bg-white">
              {THEMES.find((t) => t.id === theme)?.name}
            </SelectTrigger>
            <SelectContent>
              {THEMES.map((theme) => (
                <SelectItem key={theme.id} value={theme.id}>
                  {theme.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select> */}
          {THEMES.map((t) => (
            <button
              onClick={() => {
                setTheme(t.id);
              }}
              className={cn(
                "rounded-lg border bg-white px-3 py-1.5 text-left text-sm",
                {
                  "border-orange-500": t.id === theme,
                }
              )}
              key={t.id}
            >
              <h3 className="font-medium">{t.name}</h3>
              <p className="text-xs text-zinc-400">{t.description}</p>
            </button>
          ))}
        </div>
      </aside>
      <main className="max-h-screen min-h-screen flex-grow">
        <div className="h-full pr-4 pt-4">
          <div className="relative h-full overflow-x-hidden rounded-t-lg border bg-white shadow-sm">
            <div className="sticky inset-x-0 top-0 z-50 flex gap-1 border-b bg-white px-3 py-2">
              <span className="h-3 w-3 rounded-full bg-stone-300"></span>
              <span className="h-3 w-3 rounded-full bg-stone-300"></span>
              <span className="h-3 w-3 rounded-full bg-stone-300"></span>
            </div>
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
