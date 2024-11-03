import { z } from "zod";

export const TRIAL_PERIOD_DAYS = 30;

export const PricingPlanId = z.enum(["hobby", "pro", "agency", "free"]);
export type PricingPlanId = z.infer<typeof PricingPlanId>;
export const isPricingPlanId = (value: string): value is PricingPlanId =>
  PricingPlanId.safeParse(value).success;

export const PricingPlanInterval = z.enum(["month", "year"]);
export type PricingPlanIntervalType = z.infer<typeof PricingPlanInterval>;
export const isPricingPlanInterval = (
  value: string
): value is PricingPlanIntervalType =>
  PricingPlanInterval.safeParse(value).success;

export type PricingPlan = {
  id: PricingPlanId;
  highlight?: boolean;
  title: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
};

/**
 * ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️
 * ! Changing these values will change the pricing of the plans in Stripe.
 * ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️
 */
export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    title: "Solo",
    description: "For personal blogs or small projects",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      "1 blog",
      "Unlimited posts",
      "Limited files",
      "20k API requests per month",
    ],
  },
  {
    id: "hobby",
    highlight: true,
    title: "Small",
    description: "Perfect for you and your side projects",
    monthlyPrice: 9,
    yearlyPrice: 72, // will be divided by 12 in pricing page
    features: [
      "$4 per blog",
      "2 blogs",
      "Unlimited posts",
      "50k API requests per blog per month",
      "Limited media files",
      "Email support",
    ],
  },
  {
    id: "pro",
    title: "Pro",
    description: "For professional blogs and projects",
    monthlyPrice: 30,
    yearlyPrice: 300,
    features: [
      "$2.5 per blog",
      "10 blogs",
      "Unlimited posts",
      "50k API requests per blog per month",
      "Unlimited media files",
      "Email support",
    ],
  },
  // {
  //   id: "agency",
  //   title: "Agency",
  //   description: "For professional agencies",
  //   monthlyPrice: 140,
  //   yearlyPrice: 1200,
  //   features: [
  //     "Unlimited blogs",
  //     "Unlimited posts",
  //     "100k API requests per blog per month",
  //     "Unlimited media files",
  //     "Priority support",
  //   ],
  // },
];
