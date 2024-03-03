import { getSupabaseBrowserClient } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

const SUBSCRIPTION_KEYS = ["subscription"];

export function useSubscriptionQuery() {
  const sb = getSupabaseBrowserClient();

  return useQuery(SUBSCRIPTION_KEYS, async () => {
    const { data, error } = await sb.from("subscriptions").select("*").limit(1);

    if (error) {
      console.error(error);
      throw error;
    }

    return data[0];
  });
}

export function useIsSubscribed() {
  const { isLoading, data } = useSubscriptionQuery();

  if (isLoading) {
    return true; // Assume subscribed to avoid flicker
  }

  const isSubscribed = data?.status === "active";

  return isSubscribed;
}
