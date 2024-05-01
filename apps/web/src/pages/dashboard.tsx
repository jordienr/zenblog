import { BlogSelector } from "@/components/Blogs/BlogSelector";
import { createAPIClient } from "@/lib/http/api";
import { useRouter } from "next/router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useBlogsQuery } from "@/queries/blogs";

export default function Dashboard() {
  const router = useRouter();
  const api = createAPIClient();

  const [selectedBlog, setSelectedBlog] = useState<string | null>(null);
  const blogs = useBlogsQuery();

  const posts = useQuery(
    ["posts", selectedBlog],
    () => {
      return api.posts.getAll(selectedBlog as string);
    },
    {
      enabled: !!selectedBlog,
    }
  );

  function onBlogsSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const blog = blogs.data?.find((blog) => blog.title === e.target.value);
    if (!blog) return;
  }
  return (
    <div className="">
      <aside className="flex h-screen w-64 flex-col border-r p-4">
        {/* <BlogSelector /> */}

        {posts.data?.posts?.map((post) => (
          <div key={post.id} className="flex flex-col">
            <h2>{post.title}</h2>
          </div>
        ))}
      </aside>
    </div>
  );
}
