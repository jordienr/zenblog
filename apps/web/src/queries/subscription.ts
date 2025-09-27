import {
  PricingPlanId,
  PricingPlanIntervalType,
} from "@/lib/pricing.constants";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { useUser } from "@/utils/supabase/browser";
import { useQuery } from "@tanstack/react-query";
import Stripe from "stripe";

const SUBSCRIPTION_KEYS = ["subscription"];

/**
 * Returns the user's subscription data.
 * @returns
 * - plan: The user's subscription plan.
 * - interval: The user's subscription interval.
 * - status: The user's subscription status.
 * - isValidSubscription: Whether the user's subscription is valid (active, trialing, or past due).
 */
export function useSubscriptionQuery() {
  const sb = createSupabaseBrowserClient();
  const user = useUser();

  return useQuery({
    queryKey: SUBSCRIPTION_KEYS,
    enabled: !!user,
    queryFn: async () => {
      const { data } = await sb
        .from("subscriptions")
        .select("plan, status, interval, subscription")
        .eq("user_id", user?.id || "")
        .limit(1)
        .throwOnError();

      const res = data?.[0];

      if (!res) {
        return {
          plan: "free",
          interval: "month",
          status: "active",
          isValidSubscription: true,
          subscription: null,
        };
      }

      const plan = res.plan || "free";
      const interval = res.interval as PricingPlanIntervalType | undefined;
      const status = res?.status;

      const validSubscriptionStatus = ["active", "trialing", "past_due"];
      const isValidSubscription =
        status && validSubscriptionStatus.includes(status);

      return {
        plan,
        interval,
        status,
        isValidSubscription,
        subscription: res.subscription as unknown as Stripe.Subscription,
      };
    },
  });
}
