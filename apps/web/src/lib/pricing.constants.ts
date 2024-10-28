import { z } from "zod";

export const TRIAL_PERIOD_DAYS = 30;

export const PricingPlanTier = z.enum(["hobby", "pro", "free"]);
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
    title: "Zenblog Free Plan",
    description: "For personal blogs and small projects",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: ["1 blog", "100 posts", "50 media files", "Limited API access"],
  },
  {
    id: "hobby",
    highlight: true,
    title: "Zenblog Hobby Plan",
    description: "For personal blogs and small projects",
    monthlyPrice: 9,
    yearlyPrice: 72, // will be divided by 12 in pricing page
    features: [
      "2 blogs",
      "Unlimited posts",
      "Limited API access",
      "Limited media files",
    ],
  },
  {
    id: "pro",
    title: "Zenblog Pro Plan",
    description: "For professional blogs and projects",
    monthlyPrice: 30,
    yearlyPrice: 300,
    features: [
      "Unlimited blogs",
      "Unlimited posts",
      "Unlimited API access",
      "Unlimited media files",
    ],
  },
];
