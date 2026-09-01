import {
  formatPrice,
  getYearlySavingsPercentage,
} from "../pricing.constants";
import {
  getCheckoutPricing,
  getPricingCatalog,
  getPricingPlan,
} from "./pricing";
import { describe, expect, test } from "vitest";

describe("server pricing", () => {
  test("keeps the Pro prices in backend cents", () => {
    const pro = getPricingPlan("pro");

    expect(pro?.prices.month).toEqual({
      currency: "usd",
      unitAmount: 999,
    });
    expect(pro?.prices.year).toEqual({
      currency: "usd",
      unitAmount: 6000,
    });
  });

  test("builds Stripe line items from the same backend prices", () => {
    expect(getCheckoutPricing("pro", "month")?.lineItem).toMatchObject({
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: 999,
        recurring: { interval: "month" },
      },
    });
    expect(getCheckoutPricing("pro", "year")?.lineItem).toMatchObject({
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: 6000,
        recurring: { interval: "year" },
      },
    });
    expect(getCheckoutPricing("free", "month")).toBeNull();
  });

  test("exposes matching UI values and trial", () => {
    const catalog = getPricingCatalog();
    const pro = getPricingPlan("pro");

    expect(catalog.trialPeriodDays).toBe(14);
    expect(pro).toBeDefined();
    expect(formatPrice(pro!.prices.month)).toBe("$9.99");
    expect(formatPrice(pro!.prices.year)).toBe("$60");
    expect(getYearlySavingsPercentage(pro!)).toBe(50);
  });
});
