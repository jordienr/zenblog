import { z } from "zod";

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
  prices: Record<PricingPlanIntervalType, PricingPlanPrice>;
  features: readonly string[];
};

export type PricingPlanPrice = {
  currency: string;
  unitAmount: number;
};

export type PricingCatalog = {
  plans: readonly PricingPlan[];
  trialPeriodDays: number;
};

export const MAX_BLOGS_PER_PLAN: Record<PricingPlanId, number> = {
  free: 1,
  pro: 999,
};

export const PRICING_PLAN_TITLES: Record<PricingPlanId, string> = {
  free: "Free",
  pro: "Pro",
};

export function formatPrice({ currency, unitAmount }: PricingPlanPrice) {
  const hasCents = unitAmount % 100 !== 0;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(unitAmount / 100);
}

export function getYearlySavingsPercentage(plan: PricingPlan) {
  const monthlyTotal = plan.prices.month.unitAmount * 12;

  if (monthlyTotal === 0) {
    return 0;
  }

  return Math.round(
    ((monthlyTotal - plan.prices.year.unitAmount) / monthlyTotal) * 100
  );
}
