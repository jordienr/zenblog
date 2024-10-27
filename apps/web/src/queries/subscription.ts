import { PricingPlan, PricingPlanIntervalType } from "@/lib/pricing.constants";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { useUser } from "@/utils/supabase/browser";
import { QueryOptions, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import Stripe from "stripe";

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
        .select("subscription")
        .eq("user_id", user?.id || "")
        .limit(1)
        .throwOnError();

      const res = data?.[0]?.subscription as unknown as Stripe.Subscription;

      const plan = res?.metadata?.plan_id as PricingPlan | undefined;
      const interval = res?.items?.data[0]?.plan?.interval as
        | Stripe.Plan.Interval
        | undefined;
      const status = res?.status;
      return {
        plan,
        interval,
        status,
      };
    },
  });
}
