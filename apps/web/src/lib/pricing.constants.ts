import { z } from "zod";

export const TRIAL_PERIOD_DAYS = 14;

export const PricingPlanId = z.enum(["pro", "free"]);
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

export const MAX_BLOGS_PER_PLAN: Record<PricingPlanId, number> = {
  free: 1,
  pro: 999,
};

export const PRICING_PLANS: PricingPlan[] = [
  // ALWAYS KEEP FREE PLAN FIRST IN THE ARRAY
  {
    id: "free",
    title: "Free",
    description: "For personal blogs or small projects",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      "1 blog",
      "1 author",
      "Unlimited posts",
      "Limited files",
      "40k API requests per month",
      "Limited media files",
      "Email support",
    ],
  },
  {
    id: "pro",
    title: "Pro",
    description: "For growing teams",
    monthlyPrice: 20,
    yearlyPrice: 200,
    features: [
      "Unlimited blogs",
      "Unlimited authors",
      "Unlimited posts",
      "Unlimited categories",
      "Unlimited tags",
      "Unlimited API requests",
      "Unlimited media files",
      "Email support",
    ],
  },
];
