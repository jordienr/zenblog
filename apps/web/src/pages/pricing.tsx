import Footer from "@/components/Footer";
import Navigation from "@/components/marketing/Navigation";
import { Button } from "@/components/ui/button";
import { Section } from "@/layouts/AppLayout";
import {
  formatPrice,
  getYearlySavingsPercentage,
} from "@/lib/pricing.constants";
import type {
  PricingCatalog,
  PricingPlan,
  PricingPlanIntervalType,
} from "@/lib/pricing.constants";
import { getPricingCatalog } from "@/lib/server/pricing";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

type PricingPageProps = {
  pricing: PricingCatalog;
};

export const getServerSideProps: GetServerSideProps<
  PricingPageProps
> = async () => ({
  props: {
    pricing: getPricingCatalog(),
  },
});

export default function Pricing({ pricing }: PricingPageProps) {
  const [subscriptionType, setSubscriptionType] =
    useState<PricingPlanIntervalType>("year");
  const paidPlan = pricing.plans.find(
    (plan) => plan.prices.month.unitAmount > 0
  );
  const yearlySavings = paidPlan ? getYearlySavingsPercentage(paidPlan) : 0;

  const router = useRouter();
  return (
    <div>
      <Head>
        <title>Zenblog - Pricing</title>
        <meta name="description" content="Simple, headless, blogging CMS." />
        <link rel="icon" href="/static/logo.svg" />
      </Head>
      <Navigation />
      <main className="mx-auto mt-8 max-w-4xl px-4">
        <div className="text-center">
          <h1 className="text-2xl font-medium">
            Start for free, upgrade when you need it
          </h1>
          <p className="mt-2 text-slate-500">
            Simple pricing, cancel anytime, no questions asked.
          </p>
        </div>
        <div className="mt-8">
          <div className="flex items-center justify-center gap-1">
            <Button
              variant={subscriptionType === "month" ? "secondary" : "ghost"}
              aria-pressed={subscriptionType === "month"}
              onClick={() => setSubscriptionType("month")}
            >
              Monthly
            </Button>
            <Button
              variant={subscriptionType === "year" ? "secondary" : "ghost"}
              aria-pressed={subscriptionType === "year"}
              onClick={() => setSubscriptionType("year")}
            >
              Yearly{yearlySavings > 0 ? ` (Save ${yearlySavings}%)` : ""}
            </Button>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {pricing.plans.map((plan) => (
              <PricingCard
                key={plan.id}
                plan={plan}
                trialPeriodDays={pricing.trialPeriodDays}
                type={subscriptionType}
                headingLevel="h2"
                isCurrentPlan={false}
                onClick={() => {
                  router.push(`/sign-in`);
                }}
              />
            ))}
          </div>
        </div>

        <Section className="mt-24 px-4 py-4">
          <h2 className="text-xl font-medium">FAQ</h2>
          <p className="mt-2 text-slate-500">
            Frequently asked questions about Zenblog pricing.
          </p>
          <FAQItem
            question="What is your refund policy?"
            answer={
              <>
                You can request a refund within 14 days of your initial purchase
                or renewal date. Email us at support@zenblog.com with your
                account details and reason for the refund request.
                <br />
                <Link className="underline" href="/terms">
                  Read more about our refund policy here
                </Link>
              </>
            }
          />
          <FAQItem
            question="Can I cancel my subscription anytime?"
            answer="Yes, you can cancel your subscription at any time. No questions asked."
          />
          <FAQItem
            question="Do you offer discounts for non-profits or educational institutions?"
            answer="Yes, we do. Please contact us at support@zenblog.com for more information."
          />
        </Section>
      </main>
      <div className="mt-24">
        <Footer />
      </div>
    </div>
  );
}

export function PricingCard({
  plan,
  trialPeriodDays,
  onClick,
  type,
  headingLevel = "h3",
  isCurrentPlan,
}: {
  plan: PricingPlan;
  trialPeriodDays: number;
  onClick: () => void;
  type: PricingPlanIntervalType;
  headingLevel?: "h2" | "h3";
  isCurrentPlan: boolean;
}) {
  const price = plan.prices[type];

  const pricingText = (() => {
    if (price.unitAmount === 0) {
      return <p className="text-2xl font-medium">Free</p>;
    }

    if (type === "month") {
      return (
        <p className="text-slate-500">
          <span className="text-2xl font-medium text-slate-900">
            {formatPrice(price)}
          </span>{" "}
          per month <br />
          billed monthly
        </p>
      );
    }

    const monthlyEquivalent = formatPrice({
      ...price,
      unitAmount: Math.round(price.unitAmount / 12),
    });

    return (
      <p className="text-slate-500">
        <span className="text-2xl font-medium text-slate-900">
          {formatPrice(price)}
        </span>{" "}
        per year <br />
        {monthlyEquivalent} per month
      </p>
    );
  })();

  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-2xl border bg-white px-5 py-3 pb-5",
        plan.highlight && "border-orange-500 ring-4 ring-orange-200"
      )}
    >
      {headingLevel === "h2" ? (
        <h2 className="text-lg font-medium">{plan.title}</h2>
      ) : (
        <h3 className="text-lg font-medium">{plan.title}</h3>
      )}
      <div className="h-16">{pricingText}</div>
      <ul className="mt-5 h-full flex-1 space-y-2 font-medium">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center">
            <CheckIcon className="mr-2 h-4 w-4 text-orange-500" />
            {feature}
          </li>
        ))}
      </ul>
      <div className="mt-5">
        <span className="text-xs font-medium text-slate-500">
          * Under fair use policy
        </span>
      </div>
      {!isCurrentPlan && (
        <div className="mt-5">
          {price.unitAmount !== 0 && (
            <div className="mb-2 text-center font-mono text-xs text-slate-500">
              Try it free for {trialPeriodDays} days!
            </div>
          )}
          <Button className="w-full" onClick={onClick}>
            Get started
          </Button>
        </div>
      )}
      {isCurrentPlan && (
        <div className="mt-5">
          <p className="text-center text-slate-500">Current plan</p>
        </div>
      )}
    </div>
  );
}

function FAQItem({
  question,
  answer,
}: {
  question: string;
  answer: React.ReactNode;
}) {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-medium">{question}</h3>
      <p className="mt-2 text-slate-500">{answer}</p>
    </div>
  );
}
