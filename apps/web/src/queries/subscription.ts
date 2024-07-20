import { createSupabaseBrowserClient } from "@/lib/supabase";
import { QueryOptions, useQuery } from "@tanstack/react-query";

const SUBSCRIPTION_KEYS = ["subscription"];

export function useSubscriptionQuery() {
  const sb = createSupabaseBrowserClient();

  return useQuery({
    queryKey: SUBSCRIPTION_KEYS,
    queryFn: async () => {
      const { data, error } = await sb
        .from("subscriptions")
        .select("status")
        .limit(1);

      if (error || !data[0]) {
        console.error(error);
        return {
          status: "inactive",
        };
      }

      return data[0];
    },
    initialData: {
      status: "active",
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function usePlan() {
  const { data, isLoading } = useSubscriptionQuery();

  if (isLoading) {
    return "loading";
  }

  if (data?.status === "active") {
    return "pro";
  } else {
    return "free";
  }
}

export function useIsSubscribed() {
  const { isFetching, data } = useSubscriptionQuery();

  if (isFetching) {
    return false; // Assume subscribed to avoid flicker
  }

  const isSubscribed = data?.status === "active";

  return isSubscribed;
}
