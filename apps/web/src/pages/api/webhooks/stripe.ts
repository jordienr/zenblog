import { NextApiHandler } from "next";
import { createStripeClient } from "@/lib/server/stripe";
import getRawBody from "raw-body";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/server/supabase/admin";

console.log("----");
console.log("----");
console.log("----");
console.log("----");
console.log("----");
console.log("----");
console.log("----");
console.log("----");

const stripe = createStripeClient();
const supabase = createAdminClient();

async function upsertSubscription(event: Stripe.Event) {
  if (
    event.type === "customer.subscription.created" ||
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    const cusId = event.data.object.customer;

    if (typeof cusId !== "string" || !cusId) {
      console.error("Invalid customer id");
      throw new Error("Invalid customer id");
    }

    const customer = await stripe.customers.retrieve(cusId);

    const userId = customer.deleted ? null : customer.metadata.userId;

    if (!userId) {
      console.error("Invalid user id");
      throw new Error("Invalid user id");
    }

    const res = await supabase.from("subscriptions").upsert(
      {
        stripe_subscription_id: event.data.object.id,
        user_id: userId,
        status: event.data.object.status,
        subscription: event.data.object as any,
      },
      {
        onConflict: "user_id",
      }
    );

    console.log(res);
  }
}

async function upsertProduct(event: Stripe.Event) {
  if (
    event.type !== "product.created" &&
    event.type !== "product.updated" &&
    event.type !== "product.deleted"
  ) {
    throw new Error("Invalid event type");
  }

  const product = event.data.object;

  if (!product.active) {
    return;
  }

  if (typeof product.id !== "string" || !product.id) {
    throw new Error("Invalid product id");
  }

  // Update product in database
  const supabase = createAdminClient();

  await supabase.from("products").upsert({
    stripe_product_id: product.id,
    product: product as any,
  });
}

async function upserCustomer(event: Stripe.Event) {
  if (event.type !== "customer.created") {
    throw new Error("Invalid event type");
  }

  const customer = event.data.object;

  if (typeof customer.id !== "string" || !customer.id) {
    throw new Error("Invalid customer id");
  }

  // Update customer in database
  // await supabase.from("customers").upsert({
  //   id: customer.id,
  //   email: customer.email,
  // });
}

async function upsertPrice(event: Stripe.Event) {
  if (event.type !== "price.created") {
    throw new Error("Invalid event type");
  }

  const price = event.data.object;

  if (!price.active) {
    return;
  }

  if (typeof price.id !== "string" || !price.id) {
    throw new Error("Invalid price id");
  }

  // Update price in database
  const supabase = createAdminClient();

  await supabase.from("prices").upsert({
    stripe_price_id: price.id,
    price: price as any,
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

    type EventHandler = (event: Stripe.Event) => Promise<void>;
    type EventKey = Stripe.Event["type"];
    type EventMap = {
      [key in EventKey]?: EventHandler;
    };

    const eventMap: EventMap = {
      "customer.subscription.created": upsertSubscription,
      "customer.subscription.updated": upsertSubscription,
      "customer.subscription.deleted": upsertSubscription,
      "product.created": upsertProduct,
      "product.updated": upsertProduct,
      "product.deleted": upsertProduct,
      "price.created": upsertPrice,
      "price.updated": upsertPrice,
      "price.deleted": upsertPrice,
    };

    const handler = eventMap[event.type];

    if (!handler) {
      // If there isnt a handler just return 200, we dont need to handle this event
      res.status(200).send("OK");
      return;
    }

    console.log("🟢 Stripe: ", event.type);
    await handler(event);
    res.status(200).send("OK");
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ error: "Error updating subscription" });
  }
};

export default handler;
