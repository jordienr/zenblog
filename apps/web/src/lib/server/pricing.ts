import type {
  PricingCatalog,
  PricingPlanId,
  PricingPlanIntervalType,
} from "../pricing.constants";

const PRICING_CATALOG = {
  trialPeriodDays: 14,
  plans: [
    {
      id: "free",
      title: "Free",
      description: "For personal blogs or small projects",
      prices: {
        month: { currency: "usd", unitAmount: 0 },
        year: { currency: "usd", unitAmount: 0 },
      },
      features: [
        "1 blog",
        "1 author",
        "Unlimited posts",
        "Limited files",
        "40k API requests per month",
        "Limited images",
        "Limited videos",
        "Email support",
      ],
    },
    {
      id: "pro",
      title: "Pro",
      description: "For growing teams",
      prices: {
        month: { currency: "usd", unitAmount: 999 },
        year: { currency: "usd", unitAmount: 6000 },
      },
      features: [
        "Unlimited blogs",
        "Unlimited authors",
        "Unlimited posts",
        "Unlimited categories",
        "Unlimited tags",
        "Unlimited API requests",
        "Unlimited images *",
        "Unlimited videos *",
        "Email support",
      ],
    },
  ],
} as const satisfies PricingCatalog;

export function getPricingCatalog(): PricingCatalog {
  return PRICING_CATALOG;
}

export function getPricingPlan(planId: PricingPlanId) {
  return PRICING_CATALOG.plans.find((plan) => plan.id === planId);
}

export function getPaidPlanPrice(
  planId: PricingPlanId,
  interval: PricingPlanIntervalType
) {
  const plan = getPricingPlan(planId);
  const price = plan?.prices[interval];

  if (!plan || !price || price.unitAmount <= 0) {
    return null;
  }

  return { plan, price };
}

export function getCheckoutPricing(
  planId: PricingPlanId,
  interval: PricingPlanIntervalType
) {
  const selectedPricing = getPaidPlanPrice(planId, interval);

  if (!selectedPricing) {
    return null;
  }

  const { plan, price } = selectedPricing;

  return {
    plan,
    lineItem: {
      quantity: 1,
      price_data: {
        product_data: {
          name: plan.title,
          description: plan.description,
        },
        currency: price.currency,
        unit_amount: price.unitAmount,
        recurring: {
          interval,
        },
      },
    },
  };
}
