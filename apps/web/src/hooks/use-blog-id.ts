import { useRouter } from "next/router";

export function useBlogId() {
  const router = useRouter();
  const blogId = router.query.blogId as string;

  return blogId;
}
