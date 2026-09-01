import { API } from "app/utils/api-client";
import { useQuery } from "@tanstack/react-query";

export const PRICING_QUERY_KEY = ["pricing"];

export function usePricingQuery() {
  return useQuery({
    queryKey: PRICING_QUERY_KEY,
    queryFn: async () => {
      const response = await API().v2.pricing.$get();

      if (!response.ok) {
        throw new Error("Error loading pricing");
      }

      return response.json();
    },
  });
}
