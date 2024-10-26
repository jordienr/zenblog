import Footer from "@/components/Footer";
import Navigation from "@/components/marketing/Navigation";
import { Button } from "@/components/ui/button";
import { Section, SectionHeader, SectionTitle } from "@/layouts/AppLayout";
import { PRICING_PLANS } from "@/lib/pricing.constants";
import { CheckIcon } from "lucide-react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Pricing() {
  const [subscriptionType, setSubscriptionType] = useState<"month" | "year">(
    "year"
  );

  const router = useRouter();
  return (
    <div>
      <Head>
        <title>Zenblog - Pricing</title>
        <meta
          name="description"
          content="Simple, open source, headless, blogging CMS."
        />
        <link rel="icon" href="/static/favicon.ico" />
      </Head>
      <Navigation />
      <main className="mx-auto max-w-4xl px-4">
        <h1 className="text-2xl font-medium">Zenblog Pricing</h1>
        <p className="mt-2 text-slate-500">
          Simple pricing, cancel anytime, no questions asked.
        </p>
        <div className="mt-8">
          <div className="flex items-center gap-1">
            <Button
              variant={subscriptionType === "month" ? "secondary" : "ghost"}
              onClick={() => setSubscriptionType("month")}
            >
              Monthly
            </Button>
            <Button
              variant={subscriptionType === "year" ? "secondary" : "ghost"}
              onClick={() => setSubscriptionType("year")}
            >
              Yearly (2 months free)
            </Button>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {PRICING_PLANS.map((plan) => (
              <PricingCard
                key={plan.title}
                {...plan}
                type={subscriptionType}
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
  id,
  title,
  monthlyPrice,
  yearlyPrice,
  features,
  onClick,
  type,
}: {
  id: string;
  title: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  onClick: () => void;
  type: "month" | "year";
}) {
  const yearlyToMonth = yearlyPrice / 12;

  const PricingText = () => {
    if (monthlyPrice === 0) {
      return <p className="text-2xl font-medium">Free</p>;
    }
    if (type === "month") {
      return (
        <p className="text-slate-500">
          <span className="mr-1 text-xl">$</span>
          <span className="text-2xl font-medium text-slate-900">
            {monthlyPrice}
          </span>{" "}
          per month <br />
          billed monthly
        </p>
      );
    }
    return (
      <p className="text-slate-500">
        <span className="mr-1 text-xl">$</span>
        <span className="text-2xl font-medium text-slate-900">
          {yearlyToMonth}
        </span>{" "}
        per month <br />
        billed ${yearlyPrice} yearly
      </p>
    );
  };

  function getButtonVariant() {
    if (id === "pro") {
      return "default";
    }
    return "outline";
  }

  return (
    <div className="rounded-2xl border p-4">
      <h3 className="text-lg font-medium">{title}</h3>
      <div className="h-16">
        <PricingText />
      </div>
      <ul className="mt-5 space-y-2 font-medium">
        {features.map((feature) => (
          <li key={feature} className="flex items-center">
            <CheckIcon className="mr-2 h-4 w-4" />
            {feature}
          </li>
        ))}
      </ul>
      <div className="mt-5">
        <Button variant={getButtonVariant()} onClick={onClick}>
          Get started
        </Button>
      </div>
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
