import { env } from "@/env.mjs";
import { NextApiHandler } from "next";
import { createStripeClient } from "@/lib/server/stripe";
import getRawBody from "raw-body";
import { createAdminClient } from "@/lib/server/supabase";
import Stripe from "stripe";

const stripe = createStripeClient();

async function updateSubscription(event: Stripe.Event) {
  if (
    event.type !== "customer.subscription.updated" &&
    event.type !== "customer.subscription.deleted"
  ) {
    throw new Error("Invalid event type");
  }

  const cusId = event.data.object.customer;

  if (typeof cusId !== "string" || !cusId) {
    throw new Error("Invalid customer id");
  }

  const customer = await stripe.customers.retrieve(cusId);

  const userId = customer.deleted ? null : customer.metadata.userId;

  if (!userId) {
    throw new Error("Invalid user id");
  }

  // Update customer in database
  const supabase = createAdminClient();

  console.log(
    "🟢 UPDATING SUBSCRIPTION STATUS: ",
    event.data.object.cancellation_details,
    userId
  );

  await supabase.from("subscriptions").upsert({
    user_id: userId,
    status: event.data.object.status,
    event: event,
  });
}

async function upsertProduct(event: Stripe.Event) {
  if (event.type !== "product.created") {
    throw new Error("Invalid event type");
  }

  const product = event.data.object;

  if (typeof product.id !== "string" || !product.id) {
    throw new Error("Invalid product id");
  }

  // Update product in database
  const supabase = createAdminClient();

  console.log("🟢 CREATING PRODUCT: ", product.id);

  await supabase.from("products").upsert({
    id: product.id,
    name: product.name,
    active: product.active,
  });
}

async function upsertPrice(event: Stripe.Event) {
  if (event.type !== "price.created") {
    throw new Error("Invalid event type");
  }

  const price = event.data.object;

  if (typeof price.id !== "string" || !price.id) {
    throw new Error("Invalid price id");
  }

  // Update price in database
  const supabase = createAdminClient();

  console.log("🟢 CREATING PRICE: ", price.id);

  await supabase.from("prices").upsert({
    id: price.id,
    product_id: price.product,
    currency: price.currency,
    unit_amount: price.unit_amount,
    active: price.active,
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
const handler: NextApiHandler = async (req, res) => {
  try {
    if (req.method !== "POST") {
      res.status(405).send("Method not allowed");
    }
    const signature = req.headers["stripe-signature"];
    const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const rawBody = await getRawBody(req);

    if (typeof signature !== "string") {
      return res.status(400).send("Invalid signature");
    }
    if (!whSecret) {
      console.log("Missing process.env.STRIPE_WEBHOOK_SECRET");
      res
        .status(500)
        .json({ error: "Missing process.env.STRIPE_WEBHOOK_SECRET" });
      return;
    }

    const event = stripe.webhooks.constructEvent(rawBody, signature, whSecret);

    if (!event) {
      console.error("Invalid event");
      res.status(400).send("Invalid event");
      return;
    }

    if (event.type === "customer.subscription.updated") {
      console.log("🟢 UPDATED");
      await updateSubscription(event);
      res.status(200).send("success");
    } else if (event.type === "customer.subscription.deleted") {
      console.log("🟢 DELETED");
      await updateSubscription(event);
      res.status(200).send("success");
    } else if (event.type === "product.created") {
      console.log("🟢 PRODUCT CREATED");

      res.status(200).send("success");
    } else {
      return res
        .status(200)
        .send(`Unhandled event type: ${event.type} ${event.id}`);
    }
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ error: "Error updating subscription" });
  }
};

export default handler;
