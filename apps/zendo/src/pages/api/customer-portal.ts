import { NextApiHandler } from "next";
import { getServerClient } from "@/lib/server/deprecated/supabase";
import {
  createOrRetrieveCustomer,
  createStripeClient,
} from "@/lib/server/stripe";
import Stripe from "stripe";

const handler: NextApiHandler = async (req, res) => {
  try {
    const stripe = createStripeClient();
    const { user, db } = await getServerClient(req, res);

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!user.email) {
      return res.status(400).json({ error: "User email not found" });
    }

    const customer = await createOrRetrieveCustomer({
      userId: user.id,
      email: user.email,
    });

    const products = await db.from("products").select("*");
    const prices = await db.from("prices").select("*");

    if (!products.data || !prices.data) {
      return res
        .status(500)
        .json({ error: "Error fetching products and prices" });
    }

    const subscriptionUpdateConfig = products.data?.map((product) => ({
      product: product.stripe_product_id,
      prices: prices.data
        ?.filter(
          (price) =>
            (price.price as unknown as Stripe.Price).product ===
            product.stripe_product_id
        )
        .map((price) => price.stripe_price_id),
    }));

    const configuration = await stripe.billingPortal.configurations.create({
      features: {
        customer_update: {
          enabled: true,
          allowed_updates: ["address", "name", "phone", "tax_id"],
        },
        invoice_history: {
          enabled: true,
        },
        payment_method_update: {
          enabled: true,
        },
        subscription_cancel: {
          enabled: true,
          mode: "immediately",
          cancellation_reason: {
            enabled: true,
            options: [
              "customer_service",
              "low_quality",
              "missing_features",
              "other",
              "unused",
              "too_expensive",
              "too_complex",
              "switched_service",
            ],
          },
        },
        subscription_update: {
          enabled: true,
          proration_behavior: "create_prorations",
          default_allowed_updates: ["price", "promotion_code"],
          products: subscriptionUpdateConfig.map((config) => ({
            product: config.product!,
            prices: config.prices,
          })),
        },
      },
      business_profile: {
        headline: "Zenblog partners with Stripe for simplified billing",
      },
    });

    const session = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      configuration: configuration.id,
      return_url: "http://localhost:3000/account",
    });
    res.status(200).json({ session: session.url });
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: "Error creating session" });
  }
};

export default handler;
