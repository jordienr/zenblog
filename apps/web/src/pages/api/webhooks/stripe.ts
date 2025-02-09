import { NextApiHandler } from "next";
import { createStripeClient } from "@/lib/server/stripe";
import getRawBody from "raw-body";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/server/supabase/admin";
import { axiom, AXIOM_DATASETS } from "lib/axiom";

const stripe = createStripeClient();
const supabase = createAdminClient();

const validEvents = [
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "customer.subscription.paused",
  "customer.subscription.resumed",
  "customer.subscription.trial_will_end",
  "customer.subscription.pending_update_applied",
  "customer.subscription.pending_update_expired",
];

async function upsertSubscription(event: Stripe.Event) {
  if (!validEvents.includes(event.type)) {
    return;
  }

  const subscription = event.data.object as Stripe.Subscription;
  const cusId = subscription.customer;

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

  const isCancelled = subscription.status === "canceled";

  const plan = isCancelled ? null : subscription.metadata.plan_id;

  const res = await supabase.from("subscriptions").upsert(
    {
      stripe_subscription_id: subscription.id,
      user_id: userId,
      status: subscription.status,
      plan,
      subscription: subscription as any,
    },
    {
      onConflict: "user_id",
    }
  );

  console.log("error: ", res.error);
  console.log("data: ", res.data);
  axiom.ingest(AXIOM_DATASETS.stripe, {
    message: "Stripe subscription upserted",
    payload: { event, res },
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
      "customer.subscription.paused": upsertSubscription,
      "customer.subscription.resumed": upsertSubscription,
      "customer.subscription.trial_will_end": upsertSubscription,
      "customer.subscription.pending_update_applied": upsertSubscription,
      "customer.subscription.pending_update_expired": upsertSubscription,
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
