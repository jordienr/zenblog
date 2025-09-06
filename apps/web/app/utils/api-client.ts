import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ManagementAPI } from "app/api/[...route]/route";
import { hc } from "hono/client";
import { toast } from "sonner";

export const API = () => {
  const client = hc<ManagementAPI>("");
  return client.api;
};

export const useAPIQuery = <T>({
  queryKey,
  queryFn,
  options,
}: {
  queryKey: string;
  queryFn: (apiClient: ReturnType<typeof API>) => Promise<T>;
  options?: UseQueryOptions<T>;
}) => {
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const apiClient = API();
      return queryFn(apiClient);
    },
    ...options,
  });
};

export function handleAPIError(error: unknown) {
  console.error(error);
  if (error instanceof Error) {
    toast.error(error.message);
    return error.message;
  } else {
    toast.error("Something went wrong");
    return "Something went wrong";
  }
}
