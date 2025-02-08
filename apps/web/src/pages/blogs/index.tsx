import AppLayout from "@/layouts/AppLayout";
import { useBlogsQuery } from "@/queries/blogs";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Plus, Settings } from "lucide-react";
import { useUser } from "@/utils/supabase/browser";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaPencilAlt } from "react-icons/fa";

export default function Dashboard() {
  const user = useUser();
  const { data, isLoading } = useBlogsQuery({ enabled: !!user });
  const router = useRouter();
  const [hovering, setHovering] = useState("");

  return (
    <AppLayout
      loading={isLoading}
      title="My blogs"
      actions={
        <Button variant="outline" asChild>
          <Link href="/blogs/create">
            <Plus />
            Create blog
          </Link>
        </Button>
      }
    >
      <div className="min-h-screen">
        <div className="mx-auto max-w-5xl">
          {data?.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-slate-500">
                <FaPencilAlt size="48" />
              </div>
              <h2 className="mt-4 text-xl font-medium">
                Start by creating a blog
              </h2>
              <Button variant="default" asChild className="mt-6">
                <Link href="/blogs/create">
                  <Plus />
                  Create blog
                </Link>
              </Button>
            </div>
          )}
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {data?.map((blog) => {
              return (
                <li
                  className="group rounded-xl border bg-white p-1 transition-all hover:border-zinc-300 hover:bg-white hover:shadow-sm"
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
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                          <Button
                            size={"icon"}
                            variant={"white"}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              router.push(`/blogs/${blog.id}/settings`);
                            }}
                            aria-label="Settings"
                            className="text-zinc-400 opacity-0 transition-all group-hover:opacity-100"
                          >
                            <Settings size="24" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Settings</TooltipContent>
                      </Tooltip>
                      <Button
                        variant={"secondary"}
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
