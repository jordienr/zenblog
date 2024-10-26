import { createSupabaseBrowserClient } from "@/lib/supabase";
import { useUser } from "@/utils/supabase/browser";
import { QueryOptions, useQuery } from "@tanstack/react-query";

const SUBSCRIPTION_KEYS = ["subscription"];

export function useSubscriptionQuery() {
  const sb = createSupabaseBrowserClient();
  const user = useUser();

  return useQuery({
    queryKey: SUBSCRIPTION_KEYS,
    queryFn: async () => {
      const { data, error } = await sb
        .from("subscriptions")
        .select("status")
        .eq("user_id", user?.id || "")
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
      status: "",
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function usePlan() {
  const { data, isLoading } = useSubscriptionQuery();

  if (isLoading) {
    return "";
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
