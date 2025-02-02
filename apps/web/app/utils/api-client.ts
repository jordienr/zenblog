import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ManagementAPI } from "app/api/[...route]/route";
import { hc } from "hono/client";

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
