// Sync stripe data with supabase database

import "dotenv/config";
import { createStripeClient } from "@/lib/server/stripe";
import { createAdminClient } from "@/lib/server/supabase/admin";

const supabase = createAdminClient();
const stripe = createStripeClient();

async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// async function upsertSubscriptions() {
//     const subscriptions = await stripe.subscriptions.list({ limit: 100 });
//     for (const subscription of subscriptions.data) {
//         await supabase.from("subscriptions").upsert({
//         user_id: subscription.customer,
//         status: subscription.status,
//         stripe_subscription_id: subscription.id,
//         });
//     }
//     }

async function upsertProducts() {
  const products = await stripe.products.list({ limit: 100, active: true });
  for (const product of products.data) {
    await supabase.from("products").upsert({
      stripe_product_id: product.id,
      product: product as any,
    });
  }
}

async function upsertPrices() {
  const prices = await stripe.prices.list({ limit: 100, active: true });
  for (const price of prices.data) {
    await supabase.from("prices").upsert({
      price: price as any,
      stripe_price_id: price.id,
    });
  }
}

async function syncStripe() {
  await upsertProducts();
  console.log("Updated products");
  await wait(500);
  await upsertPrices();
  console.log("Updated prices");
}

syncStripe().catch((error) => {
  console.error(error);
  process.exit(1);
});
