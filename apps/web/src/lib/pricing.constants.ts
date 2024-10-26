type PricingPlan = {
  title: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
};

export const PRICING_PLANS: PricingPlan[] = [
  {
    title: "Hobby",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      "1 blog",
      "Unlimited posts",
      "Limited API access",
      "Limited media files",
    ],
  },
  {
    title: "Pro",
    monthlyPrice: 9,
    yearlyPrice: 90,
    features: [
      "Unlimited blogs",
      "Unlimited posts",
      "Unlimited API access",
      "Unlimited media files",
    ],
  },
];
