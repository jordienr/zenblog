import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";

const SUBSCRIPTION_KEYS = ["subscription"];

export function useSubscriptionQuery() {
  const sb = useSupabaseClient();

  return useQuery(SUBSCRIPTION_KEYS, async () => {
    const { data, error } = await sb
      .from("subscriptions")
      .select("status")
      .single();

    if (error) {
      console.error(error);
      throw error;
    }

    return { ...data, keys: SUBSCRIPTION_KEYS };
  });
}

export function useProductsQuery() {
  const sb = useSupabaseClient();

  return useQuery(["products"], async () => {
    const { data, error } = await sb.from("products").select("*");

    if (error) {
      console.error(error);
      throw error;
    }

    return data;
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
