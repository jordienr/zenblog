import { createAPIClient } from "@/lib/app/api";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { HiAdjustments, HiChevronDown, HiCog, HiPlus } from "react-icons/hi";
import { useQuery } from "react-query";

export function BlogSelector() {
  const router = useRouter();

  const currentBlogId = router.query.blogId;
  const api = createAPIClient();

  const [showSelector, setShowSelector] = useState(false);

  const getCurrentBlog = () => {
    const blogId = router.query.blogId;
    if (!blogId) return null;
    if (blogs.data) {
      return blogs.data.find((blog) => blog.id === blogId);
    } else {
      return null;
    }
  };

  const blogs = useQuery("blogs", () => {
    return api.blogs.getAll();
  });

  return (
    <div className="relative text-sm">
      <button
        className="w-64 rounded-md border bg-white p-2"
        onClick={() => setShowSelector(!showSelector)}
      >
        <div className="flex w-full items-center justify-between">
          <span>{getCurrentBlog()?.title || "Blogs"}</span>
          <HiChevronDown />
        </div>
      </button>
      {showSelector && (
        <div className="absolute z-20 mt-1 flex w-full flex-col rounded-lg border bg-white p-1">
          {blogs.data?.map((blog) => (
            <button
              key={blog.id}
              className="group flex w-full justify-between rounded p-2 text-left hover:bg-gray-100"
              onClick={() => {
                router.push(`/blog/${blog.id}`);
              }}
            >
              <div className="text-left">
                {blog.emoji} {blog.title}
              </div>
              <Link
                className="hidden text-slate-400 hover:text-slate-500 group-hover:block"
                href={`blog/${blog.id}/settings`}
              >
                <HiCog size="18" />
              </Link>
            </button>
          ))}
          <Link href="blogs/create" className="btn mt-2">
            <HiPlus />
            Create blog
          </Link>
        </div>
      )}
    </div>
  );
}
