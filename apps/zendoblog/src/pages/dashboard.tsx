import { createAPIClient } from "@/lib/app/api";
import { useRouter } from "next/router";
import { useState } from "react";
import { useQuery } from "react-query";

export default function Dashboard() {
  const router = useRouter();
  const api = createAPIClient();

  const [selectedBlog, setSelectedBlog] = useState<string | null>(null);
  const blogs = useQuery("blogs", () => api.blogs.getAll(), {
    onSuccess: (data) => {
      if (data.length === 0) {
        router.push("/blogs/new");
      } else {
        setSelectedBlog(data[0].id);
      }
    },
  });

  function onBlogsSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const blog = blogs.data?.find((blog) => blog.title === e.target.value);
    if (!blog) return;
  }
  return (
    <div className="">
      <aside className="flex h-screen w-64 flex-col border-r p-4">
        <select className="rounded-md border" onChange={onBlogsSelectChange}>
          {blogs.data?.map((blog) => (
            <option key={blog.id}>{blog.title}</option>
          ))}
        </select>
      </aside>
    </div>
  );
}
