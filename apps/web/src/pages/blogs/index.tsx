import AppLayout from "@/layouts/AppLayout";
import { useBlogsQuery } from "@/queries/blogs";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { PiPencilLine } from "react-icons/pi";
import { Paintbrush, Plus, Settings } from "lucide-react";
import { useUser } from "@/utils/supabase/browser";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Dashboard() {
  const user = useUser();
  const { data, error, isLoading } = useBlogsQuery({ enabled: !!user });
  const router = useRouter();
  const [hovering, setHovering] = useState("");

  return (
    <AppLayout loading={isLoading}>
      <div className="mt-8 min-h-screen">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center justify-between p-3">
            <h1 className="text-lg font-medium">My blogs</h1>
            <div>
              <Button variant="outline" asChild>
                <Link href="/blogs/create">
                  <Plus />
                  Create blog
                </Link>
              </Button>
            </div>
          </div>
          {data?.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-xl border bg-white p-2 shadow-sm">
                <PiPencilLine size="48" className="text-orange-500" />
              </div>
              <h2 className="mt-4 text-2xl">Start by creating a blog</h2>
              <Button variant="default" asChild className="mt-6">
                <Link href="/blogs/create">
                  <Plus />
                  Create blog
                </Link>
              </Button>
            </div>
          )}
          <ul className="mx-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {data?.map((blog) => {
              return (
                <li
                  className="group rounded-xl border bg-white p-1 transition-all hover:border-zinc-300"
                  key={blog.id}
                  onMouseEnter={() => setHovering(blog.id)}
                  onMouseLeave={() => setHovering("")}
                >
                  <Link
                    className="flex h-full w-full min-w-[320px] flex-col gap-3 rounded-xl p-3"
                    href={`/blogs/${blog.id}/posts`}
                  >
                    <div className="flex min-h-16 gap-4">
                      <div className="">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full border bg-zinc-50 text-3xl transition-all">
                          {blog.emoji}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">{blog.title}</h3>
                        <p className="text-zinc-500">{blog.description}</p>
                      </div>
                    </div>
                    <div className="mt-auto flex justify-end gap-1 justify-self-end align-bottom">
                      {/* <Button
                        size={"icon"}
                        variant={"white"}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          router.push(`/blogs/${blog.id}/customise`);
                        }}
                        title="Customise"
                        aria-label="Customise"
                        className="text-zinc-400 opacity-0 transition-all group-hover:opacity-100"
                      >
                        <Paintbrush size="24" />
                      </Button> */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size={"icon"}
                            variant={"white"}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              router.push(`/blogs/${blog.id}/settings`);
                            }}
                            title="Settings"
                            aria-label="Settings"
                            className="text-zinc-400 opacity-0 transition-all group-hover:opacity-100"
                          >
                            <Settings size="24" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Settings</TooltipContent>
                      </Tooltip>
                      <Button
                        variant={
                          hovering === blog.id ? "secondary" : "secondary"
                        }
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          router.push(`/blogs/${blog.id}/create`);
                        }}
                      >
                        New post
                      </Button>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </AppLayout>
  );
}
