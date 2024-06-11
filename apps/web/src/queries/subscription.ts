import { getSupabaseBrowserClient } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

const SUBSCRIPTION_KEYS = ["subscription"];

export function useSubscriptionQuery() {
  const sb = getSupabaseBrowserClient();

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
  });
}

export function useIsSubscribed() {
  const { isFetching, data } = useSubscriptionQuery();

  if (isFetching) {
    return false; // Assume subscribed to avoid flicker
  }

  const isSubscribed = data?.status === "active";

  return isSubscribed;
}
