import { createSupabaseBrowserClient } from "@/lib/supabase";
import { useUser } from "@/utils/supabase/browser";
import { QueryOptions, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const SUBSCRIPTION_KEYS = ["subscription"];

export function useSubscriptionQuery() {
  const sb = createSupabaseBrowserClient();
  const user = useUser();

  return useQuery({
    queryKey: SUBSCRIPTION_KEYS,
    enabled: !!user,
    queryFn: async () => {
      const { data } = await sb
        .from("subscriptions")
        .select("status, plan")
        .eq("user_id", user?.id || "")
        .limit(1)
        .throwOnError();

      return {
        status: data?.[0]?.status,
        plan: data?.[0]?.plan,
      };
    },
  });
}
