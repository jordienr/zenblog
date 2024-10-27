import { z } from "zod";

export const PricingPlanTier = z.enum(["hobby", "pro"]);
export type PricingPlanTierType = z.infer<typeof PricingPlanTier>;
export const isPricingPlanTier = (
  value: string
): value is PricingPlanTierType => PricingPlanTier.safeParse(value).success;

export const PricingPlanInterval = z.enum(["month", "year"]);
export type PricingPlanIntervalType = z.infer<typeof PricingPlanInterval>;
export const isPricingPlanInterval = (
  value: string
): value is PricingPlanIntervalType =>
  PricingPlanInterval.safeParse(value).success;

export type PricingPlan = {
  id: PricingPlanTierType;
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
    id: "hobby",
    title: "Zenblog Hobby Plan",
    description: "For personal blogs and small projects",
    monthlyPrice: 8,
    yearlyPrice: 72,
    features: [
      "1 blog",
      "Unlimited posts",
      "Limited API access",
      "Limited media files",
    ],
  },
  {
    id: "pro",
    title: "Zenblog Pro Plan",
    description: "For professional blogs and projects",
    monthlyPrice: 20,
    yearlyPrice: 192,
    features: [
      "Unlimited blogs",
      "Unlimited posts",
      "Unlimited API access",
      "Unlimited media files",
    ],
  },
];
