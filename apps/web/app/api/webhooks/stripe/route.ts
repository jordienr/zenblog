import { createStripeClient, getPriceIdByLookupKey } from "@/lib/server/stripe";
import { createAdminClient } from "@/lib/server/supabase/admin";
import { axiomIngest } from "lib/axiom";
import Stripe from "stripe";

export async function POST(req: Request) {
  const stripe = createStripeClient();
  const supabase = createAdminClient();
  const sig = req.headers.get("stripe-signature");
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !whSecret) {
    console.log("STRIPE_WEBHOOK_SECRET", whSecret);
    console.log("SIG", sig);
    return new Response("Missing signature or webhook secret", { status: 500 });
  }

  if (typeof sig !== "string" || !whSecret) {
    return new Response("Missing signature or webhook secret", { status: 500 });
  }

  let event: Stripe.Event;

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
    const plan_name = subscription.metadata.plan_name;
    const interval = subscription.metadata.interval;

    if (!userId) {
      // We have a customer, but they are not linked to a user in our system.
      // This is not an error we can recover from by retrying.
      // Log it, and return 200 to Stripe.
      console.error("Stripe webhook: userId not found in customer metadata.", {
        customerId: cusId,
        subscriptionId: subscription.id,
      });
      return new Response("User not found", { status: 200 });
    }

    const isCancelled = subscription.status === "canceled";
    const lookupKey = isCancelled
      ? undefined
      : subscription.metadata.lookup_key;

    if (!lookupKey) {
      console.log(
        "Stripe webhook: lookup_key not found in subscription metadata.",
        {
          subscriptionId: subscription.id,
          metadata: subscription.metadata,
        }
      );
    }

    const priceId = await getPriceIdByLookupKey(lookupKey);

    const { error } = await supabase.from("subscriptions").upsert(
      {
        stripe_subscription_id: subscription.id,
        user_id: userId,
        status: isCancelled ? "canceled" : subscription.status,
        price_lookup_key: lookupKey,
        plan: isCancelled ? "free" : plan_name,
        price_id: isCancelled ? null : priceId,
        subscription: subscription as any,
        interval: isCancelled ? "month" : interval,
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

  try {
    const body = await req.text();
    event = stripe.webhooks.constructEvent(body, sig, whSecret);
    const eventType = event.type;

    const eventMap = {
      "customer.subscription.created": upsertSubscription,
      "customer.subscription.updated": upsertSubscription,
      "customer.subscription.deleted": upsertSubscription,
      "customer.subscription.paused": upsertSubscription,
      "customer.subscription.resumed": upsertSubscription,
      "customer.subscription.trial_will_end": upsertSubscription,
      "customer.subscription.pending_update_applied": upsertSubscription,
      "customer.subscription.pending_update_expired": upsertSubscription,
    } as const;

    const shouldHandleEvent = Object.keys(eventMap).includes(eventType);

    if (shouldHandleEvent) {
      await eventMap[eventType as keyof typeof eventMap](event);
      return new Response("Event handled", { status: 200 });
    } else {
      return new Response("Unhandled event type", { status: 200 });
    }
  } catch (error) {
    console.error("Stripe webhook: Error verifying webhook signature", {
      error,
    });
    return new Response("Error verifying webhook signature", { status: 500 });
  }
}
