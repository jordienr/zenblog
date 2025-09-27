import { NextApiHandler } from "next";
import { createStripeClient } from "@/lib/server/stripe";
import getRawBody from "raw-body";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/server/supabase/admin";
import { axiomIngest } from "lib/axiom";

const stripe = createStripeClient();
const supabase = createAdminClient();

async function upsertSubscription(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;
  const cusId = subscription.customer;

  if (typeof cusId !== "string" || !cusId) {
    // This is an issue with the event from Stripe, not our fault.
    // We log it, and return 200 to Stripe so it doesn't retry.
    console.error(
      "Stripe webhook: Invalid customer id in subscription object.",
      {
        subscriptionId: subscription.id,
        event_type: event.type,
      }
    );
    return;
  }

  let customer: Stripe.Customer | Stripe.DeletedCustomer;
  try {
    customer = await stripe.customers.retrieve(cusId);
  } catch (error) {
    console.error("Stripe webhook: failed to retrieve customer", {
      customerId: cusId,
      subscriptionId: subscription.id,
      error,
    });
    // If we can't retrieve customer, we can't get user_id.
    // This could be a temporary issue with Stripe API.
    // Throwing will cause a 500, and Stripe will retry.
    throw error;
  }

  const userId = customer.deleted ? null : customer.metadata.userId;

  if (!userId) {
    // We have a customer, but they are not linked to a user in our system.
    // This is not an error we can recover from by retrying.
    // Log it, and return 200 to Stripe.
    console.error("Stripe webhook: userId not found in customer metadata.", {
      customerId: cusId,
      subscriptionId: subscription.id,
    });
    return;
  }

  const isCancelled = subscription.status === "canceled";
  const plan = isCancelled ? null : subscription.metadata.plan;

  if (!plan) {
    console.error("Stripe webhook: plan not found in subscription metadata.", {
      subscriptionId: subscription.id,
      metadata: subscription.metadata,
    });

    throw new Error("Plan not found in subscription metadata.");
  }

  const { error } = await supabase.from("subscriptions").upsert(
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

  if (error) {
    console.error("Stripe webhook: Error upserting subscription", {
      subscriptionId: subscription.id,
      userId,
      error,
    });
    // This is a database error on our side. Worth retrying.
    throw error;
  }

  axiomIngest("stripe", {
    message: "Stripe subscription upserted",
    payload: { event, subscriptionId: subscription.id },
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).send("Method Not Allowed");
  }

  const signature = req.headers["stripe-signature"];
  if (!signature) {
    console.error(
      "Stripe webhook: Missing signature. Ensure STRIPE_WEBHOOK_SECRET is set."
    );
    return res.status(500).send("Webhook Error: Missing signature");
  }
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!whSecret) {
    console.error(
      "Stripe webhook: Missing webhook secret. Ensure STRIPE_WEBHOOK_SECRET is set."
    );
    return res.status(500).send("Webhook Error: Missing webhook secret");
  }

  if (typeof signature !== "string" || !whSecret) {
    console.error(
      "Stripe webhook: Missing signature or webhook secret. Ensure STRIPE_WEBHOOK_SECRET is set."
    );
    return res.status(500).send("Webhook Error: Missing signature or secret");
  }

  let event: Stripe.Event;
  try {
    const rawBody = "await req.text();";
    event = stripe.webhooks.constructEvent(rawBody, signature, whSecret);
  } catch (err: any) {
    console.error(
      `Stripe webhook: Error verifying webhook signature: ${err.message}`
    );
    axiomIngest("stripe", {
      level: "error",
      message: "Stripe webhook signature verification failed",
      error: err,
    });
    return res.status(400).send(`Webhook Error: ${err.message}`);
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

  const eventHandler = eventMap[event.type];

  if (eventHandler) {
    try {
      await eventHandler(event);
      console.log("🟢 Stripe: handled event", {
        type: event.type,
        id: event.id,
      });
      res.status(200).send("OK");
    } catch (error: any) {
      console.error("Stripe webhook: event handler failed.", {
        event_type: event.type,
        error: error,
      });
      axiomIngest("stripe", {
        level: "error",
        message: "Stripe webhook event handler failed",
        event_type: event.type,
        error: error,
      });
      res
        .status(500)
        .json({ error: "Webhook handler failed. Please check logs." });
    }
  } else {
    // If there isn't a handler, just return 200. We don't need to handle this event.
    console.log("Stripe webhook: unhandled event type", { type: event.type });
    res.status(200).send("OK");
  }
};

export default handler;
