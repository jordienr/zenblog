import { Button } from "@/components/ui/button";
import AppLayout, { Section, SectionTitle } from "@/layouts/AppLayout";
import {
  PRICING_PLANS,
  PricingPlan,
  PricingPlanId,
  TRIAL_PERIOD_DAYS,
} from "@/lib/pricing.constants";
import { usePricesQuery } from "@/queries/prices";
import { useProductsQuery } from "@/queries/products";
import { useSubscriptionQuery } from "@/queries/subscription";
import { useUser } from "@/utils/supabase/browser";
import {
  Check,
  CheckCircle,
  CircleCheckIcon,
  KeyRound,
  Landmark,
  Loader,
  Loader2,
} from "lucide-react";
import React, { ReactNode, useEffect, useState } from "react";
import { toast } from "sonner";
import { PricingCard } from "../pricing";
import { API } from "app/utils/api-client";
import { getOnboardingItems, useOnboardingQuery } from "@/queries/onboarding";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Toggle } from "@/components/ui/toggle";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/router";

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
        <Loader2 className="animate-spin text-orange-500" size={24} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-lg font-medium">Upgrade your plan</h2>
      <p className="text-sm font-medium text-zinc-500">
        Try it free for {TRIAL_PERIOD_DAYS} days. Cancel anytime.
      </p>
      <div className="mt-4 flex items-center gap-2">
        <Switch
          id="yearly"
          checked={interval === "year"}
          onCheckedChange={(checked) => setInterval(checked ? "year" : "month")}
        />
        <Label htmlFor="yearly" className="text-sm font-medium">
          Pay yearly{" "}
          <span className="rounded-full bg-emerald-100 p-1 text-xs font-medium text-emerald-600">
            2 months free!
          </span>
        </Label>
      </div>

      <div className="mx-auto mt-4 grid w-full max-w-lg grid-cols-1 items-center justify-center gap-4">
        {PRICING_PLANS.filter((plan) => plan.id !== "free").map((plan) => (
          <div key={plan.title}>
            <PricingCard
              {...plan}
              type={interval}
              isCurrentPlan={false}
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
  const router = useRouter();

  const isSuccess = router.query.success === "true";

  const activeSubscriptions = ["free", "trialing", "active", "incomplete"];

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

  const isActiveSubscription = activeSubscriptions.includes(
    subscription.data?.status || ""
  );

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  }

  const planIdToTitle = (planId: PricingPlanId) => {
    return PRICING_PLANS.find((plan) => plan.id === planId)?.title || "Free";
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Subscription updated successfully");
      router.replace("/account", undefined, { shallow: true });
    }
  }, [isSuccess]);

  return (
    <AppLayout
      loading={loading || subscription.isLoading}
      title="Account settings"
      description="Manage your account and subscription"
    >
      <Section className="px-4">
        <SectionTitle>Account</SectionTitle>
        <AccountList>
          <AccountListItem label="Email" value={user?.email} />
          <AccountListItem
            label="Created at"
            value={formatDate(user?.created_at || "")}
          />
          <AccountListItem
            label="Reset password"
            value={
              <Button variant="outline" asChild>
                <Link href="/reset-password">
                  <KeyRound />
                  Reset password
                </Link>
              </Button>
            }
          />
        </AccountList>
      </Section>
      <Section className="my-4 px-4">
        <SectionTitle>Subscription</SectionTitle>
        {subscription.isLoading ? (
          <div className="flex w-full items-center justify-center py-24">
            <Loader2 className="animate-spin text-orange-500" size={24} />
          </div>
        ) : (
          <AccountList>
            <AccountListItem
              label="Status"
              valueClassName="capitalize"
              value={subscription.data?.status || "Free"}
            />
            {isActiveSubscription && (
              <>
                <AccountListItem
                  label="Plan"
                  valueClassName="capitalize"
                  value={planIdToTitle(subscription.data?.plan || "free")}
                />
                {subscription.data?.subscription?.cancel_at_period_end &&
                  subscription.data?.status !== "canceled" && (
                    <AccountListItem
                      label="Cancel at period end"
                      value={
                        <div className="rounded-md bg-emerald-50 p-2 text-sm font-medium text-emerald-600">
                          Your subscription will be canceled at the end of the
                          current period and you will not be billed again.
                        </div>
                      }
                    />
                  )}
                {subscription.data?.subscription?.created && (
                  <AccountListItem
                    label="Started at"
                    value={formatDate(
                      new Date(
                        (subscription.data?.subscription?.created || 0) * 1000
                      ).toISOString()
                    )}
                  />
                )}
                {subscription.data?.subscription.trial_end &&
                  subscription.data?.status === "trialing" && (
                    <AccountListItem
                      label="Trial ends at"
                      value={formatDate(
                        new Date(
                          (subscription.data?.subscription?.trial_end || 0) *
                            1000
                        ).toISOString()
                      )}
                    />
                  )}
                {subscription.data?.subscription?.current_period_end && (
                  <AccountListItem
                    label="Next billing date"
                    value={formatDate(
                      new Date(
                        (subscription.data?.subscription?.current_period_end ||
                          0) * 1000
                      ).toISOString()
                    )}
                  />
                )}
                <AccountListItem
                  label="Manage subscription"
                  value={
                    <Button
                      variant="outline"
                      onClick={onManageSubscriptionClick}
                    >
                      <Landmark />
                      Customer portal
                    </Button>
                  }
                ></AccountListItem>
              </>
            )}

            {/* <pre className="max-h-40 overflow-y-auto text-xs">
              {JSON.stringify(subscription.data?.subscription, null, 2)}
            </pre> */}
          </AccountList>
        )}
      </Section>

      {subscription.data?.status !== "active" &&
        subscription.data?.status !== "trialing" &&
        subscription.data?.status !== "incomplete" && (
          <section className="my-4 px-4 py-8">
            <SubscribeSection />
          </section>
        )}
    </AppLayout>
  );
};

const AccountList = ({ children }: { children: ReactNode }) => {
  return <div className="mt-4 grid max-w-xl divide-y">{children}</div>;
};

const AccountListItem = ({
  label,
  value,
  className,
  labelClassName,
  valueClassName,
}: {
  label: string;
  value: ReactNode;
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
}) => {
  return (
    <div className={cn("grid grid-cols-2 p-2", className)}>
      <div className={cn("text-sm font-medium", labelClassName)}>{label}</div>
      <div className={cn("text-sm font-medium", valueClassName)}>{value}</div>
    </div>
  );
};

export default AccountPage;
