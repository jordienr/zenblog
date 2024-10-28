import { Button } from "@/components/ui/button";
import AppLayout, { Section, SectionTitle } from "@/layouts/AppLayout";
import { PRICING_PLANS, PricingPlan } from "@/lib/pricing.constants";
import { usePricesQuery } from "@/queries/prices";
import { useProductsQuery } from "@/queries/products";
import { useSubscriptionQuery } from "@/queries/subscription";
import { useUser } from "@/utils/supabase/browser";
import { Landmark, Loader } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { PricingCard } from "../pricing";
import { API } from "app/utils/api-client";

type Props = {};

export const SubscribeSection = () => {
  const products = useProductsQuery();
  const prices = usePricesQuery();
  const user = useUser();
  const [interval, setInterval] = React.useState<"year" | "month">("year");
  const [isLoading, setIsLoading] = useState(false);
  const subscription = useSubscriptionQuery();
  async function openCheckoutPage(plan: PricingPlan) {
    setIsLoading(true);
    toast.info("Redirecting to Stripe...");

    if (!user || !user.id) {
      toast.error("User not found");
      setIsLoading(false);
      return;
    }

    const response = await API().v2.accounts[":user_id"].checkout.$get({
      param: {
        user_id: user.id,
      },
      query: {
        plan: plan.id,
        interval,
      },
    });

    const resJson = await response.json();

    console.log(resJson);

    if ("error" in resJson) {
      toast.error("Error creating checkout session");
      console.error(resJson.error);
      setIsLoading(false);
      return;
    }

    window.location.href = resJson.url;
  }

  const loading = products.isLoading || prices.isLoading || isLoading;

  if (loading) {
    return (
      <div className="flex w-full items-center justify-center py-24">
        <Loader className="animate-spin text-orange-500" size={24} />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-medium">Pick a plan</h2>
      <p className="font-mono text-sm text-zinc-500">Cancel anytime</p>
      <div className="mt-4 flex gap-2">
        <Button
          variant={interval === "month" ? "default" : "outline"}
          onClick={() => setInterval("month")}
        >
          Monthly
        </Button>
        <Button
          variant={interval === "year" ? "default" : "outline"}
          onClick={() => setInterval("year")}
        >
          Yearly
        </Button>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        {PRICING_PLANS.map((plan) => (
          <div key={plan.title}>
            <PricingCard
              {...plan}
              type={interval}
              isCurrentPlan={subscription.data?.plan === plan.id}
              onClick={() => openCheckoutPage(plan)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const AccountPage = () => {
  const [loading, setLoading] = React.useState(false);
  const user = useUser();

  async function onManageSubscriptionClick() {
    setLoading(true);
    toast.info("Redirecting to Stripe...");
    const response = await API().v2.accounts[":user_id"][
      "customer-portal"
    ].$get({
      param: {
        user_id: user?.id || "",
      },
    });

    const json = await response.json();

    if ("error" in json) {
      toast.error("Error creating customer portal");
      console.error(json);
      setLoading(false);
      return;
    }

    if (json.url) {
      console.log("redirecting to", json.url);
      window.location.href = json.url;
    } else {
      toast.error("Error creating customer portal");
      console.error(json);
      setLoading(false);
    }
  }

  const subscription = useSubscriptionQuery();

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  }

  return (
    <AppLayout
      loading={loading || subscription.isLoading}
      title="Account settings"
      description="Manage your account and subscription"
    >
      <Section className="px-4">
        <SectionTitle>Account</SectionTitle>
        <div className="mt-4 max-w-xl divide-y *:grid *:grid-cols-2 *:p-2">
          <div>
            <div>Email</div>
            <div className="font-mono">{user?.email}</div>
          </div>
          <div>
            <div>Created at</div>
            <div className="font-mono">
              {formatDate(user?.created_at || "")}
            </div>
          </div>
        </div>
      </Section>
      <Section className="my-4 rounded-xl border border-b-2 bg-white p-4">
        <SectionTitle>Subscription</SectionTitle>
        {subscription.isLoading ? (
          <div className="flex w-full items-center justify-center py-24">
            <Loader className="animate-spin text-orange-500" size={24} />
          </div>
        ) : (
          <div className="mt-4 grid max-w-xl grid-cols-2 gap-4">
            <p className="grid max-w-xl grid-cols-2">Status:</p>
            <p>{subscription.data?.status || "Free"}</p>
            {subscription.data?.interval ? (
              <>
                <p className="grid max-w-xl grid-cols-2">Current type:</p>
                <p>
                  {subscription.data?.interval === "month"
                    ? "Monthly"
                    : "Yearly"}
                </p>
              </>
            ) : null}
            {subscription.data?.status && (
              <Button variant="outline" onClick={onManageSubscriptionClick}>
                <Landmark />
                Manage subscription
              </Button>
            )}
          </div>
        )}
      </Section>

      {subscription.data?.status !== "active" && (
        <Section className="my-4 px-4 pb-4">
          <SubscribeSection />
        </Section>
      )}
    </AppLayout>
  );
};

export default AccountPage;
