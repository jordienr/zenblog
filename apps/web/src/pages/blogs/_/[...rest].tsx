import AppLayout from "@/layouts/AppLayout";
import { useBlogsQuery } from "@/queries/blogs";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function CatchAllBlogPickerPage() {
  const { data: blogs } = useBlogsQuery({ enabled: true });

  const router = useRouter();
  const blogIdToURL = (blogId: string) => router.asPath.replace(/_/, blogId);

  return (
    <AppLayout title="Select a blog to continue">
      <div className="grid gap-4 md:grid-cols-2">
        {blogs?.map((blog) => (
          <Link
            key={blog.id}
            href={blogIdToURL(blog.id)}
            className="flex items-center rounded-lg border bg-white p-4 px-6 shadow-sm hover:bg-gray-50"
          >
            <div className="w-full">
              <div className="text-2xl">{blog.emoji}</div>
              <div className="text-lg font-medium">{blog.title}</div>
              <div className="text-gray-500">{blog.description}</div>
            </div>
            <div className="text-slate-300">
              <ChevronRight />
            </div>
          </Link>
        ))}
      </div>
    </AppLayout>
  );
}
