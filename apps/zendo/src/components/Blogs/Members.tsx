import { Blog } from "@/lib/models/blogs/Blogs";
import { useBlogQuery } from "@/queries/blogs";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";

export function Members({ blog }: { blog: Blog }) {
  const router = useRouter();
  const blogId = router.query.blogId as string;

  const members = useQuery(["blog", blogId, "members"], () => {
    return fetch(`/api/blogs/${blogId}/members`).then((res) => res.json());
  });

  return (
    <div>
      <div className="flex gap-2 py-4">
        <div className="">You</div>
        <div className="text-gray-500"></div>
      </div>
      {members.data?.map(
        (member: { id: string; name: string; email: string }) => (
          <div key={member.id} className="flex items-center gap-4">
            <div className="flex flex-col">
              <div className="text-lg font-bold">{member.name}</div>
              <div className="text-gray-500">{member.email}</div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
