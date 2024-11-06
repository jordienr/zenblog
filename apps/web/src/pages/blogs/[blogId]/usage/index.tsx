import AppLayout from "@/layouts/AppLayout";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { getApiUsageForBlog } from "lib/axiom";
import { useRouter } from "next/router";
import { Skeleton } from "@/components/ui/skeleton";
import { API } from "app/utils/api-client";

export default function BlogAnalytics() {
  const router = useRouter();
  const blogId = router.query.blogId as string;

  // start time = the start of current month
  // end time = now
  const startTime = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  ).toISOString();
  const endTime = new Date().toISOString();

  const { data, isLoading } = useQuery({
    queryKey: ["api-usage", startTime, endTime],
    queryFn: () =>
      API().v2.blogs[":blog_id"].usage.$get({
        param: { blog_id: blogId },
        query: { start_time: startTime, end_time: endTime },
      }),
    enabled: !!blogId,
  });

  return (
    <AppLayout title="API Usage">
      <div className="flex flex-col gap-2">
        {isLoading ? (
          <Skeleton className="h-4 w-full" />
        ) : (
          <pre>{JSON.stringify(data, null, 2)}</pre>
        )}
      </div>
    </AppLayout>
  );
}
