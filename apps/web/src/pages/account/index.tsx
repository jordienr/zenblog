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
      <h2 className="text-lg font-medium">Pricing</h2>
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

      <div className="mt-4 grid max-w-xl grid-cols-2 gap-4">
        {PRICING_PLANS.map((plan) => (
          <div key={plan.title}>
            <PricingCard
              {...plan}
              type={interval}
              onClick={() => openCheckoutPage(plan)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const AccountPage = (props: Props) => {
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
        <SectionTitle>Subscription details</SectionTitle>
        {subscription.isLoading ? (
          <></>
        ) : (
          <p className="mt-4 grid max-w-xl grid-cols-2">
            Subscription status:{" "}
            {subscription.data?.status === "active" ? (
              <span className="inline-flex items-center gap-1 rounded-md px-3 py-1 font-mono text-emerald-700">
                {subscription.data?.status}
              </span>
            ) : (
              <span>
                <span className="rounded-md bg-yellow-100 px-3 py-1 font-mono text-yellow-600">
                  {subscription.data?.status || "Free"}
                </span>
              </span>
            )}
          </p>
        )}

        <div className="">
          {loading ? (
            <pre>Loading...</pre>
          ) : (
            <>
              {subscription.data?.status !== "active" ? (
                <>
                  <hr className="my-8 max-w-xl" />
                  <SubscribeSection />
                </>
              ) : (
                <>
                  {/* <pre>{JSON.stringify(subscription.data, null, 2)}</pre> */}
                </>
              )}
            </>
          )}
        </div>

        {subscription.data?.status === "active" && (
          <>
            <hr className="my-6 max-w-xl" />

            <h3 className="text-lg font-medium">Manage your subscription</h3>
            <p className="text-zinc-500">
              Check invoices, billing and payment information.
            </p>
            <Button
              className="mt-4"
              variant="secondary"
              onClick={onManageSubscriptionClick}
            >
              <Landmark />
              Manage subscription
            </Button>
          </>
        )}
      </Section>
    </AppLayout>
  );
};

export default AccountPage;
