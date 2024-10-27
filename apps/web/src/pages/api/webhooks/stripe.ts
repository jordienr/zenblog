import { NextApiHandler } from "next";
import { createStripeClient } from "@/lib/server/stripe";
import getRawBody from "raw-body";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/server/supabase/admin";
import { axiom, AXIOM_DATASETS } from "lib/axiom";

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

    const isCancelled = event.data.object.status === "canceled";

    const plan = isCancelled ? null : event.data.object.metadata.plan_id;

    const res = await supabase.from("subscriptions").upsert(
      {
        stripe_subscription_id: event.data.object.id,
        user_id: userId,
        status: event.data.object.status,
        plan,
        subscription: event.data.object as any,
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

// {
//   "id": "sub_1QEHXuJfDYgxbs7ZdunDUELJ",
//   "plan": {
//     "id": "price_1QEHXkJfDYgxbs7ZGdSor1jr",
//     "meter": null,
//     "active": false,
//     "amount": 19200,
//     "object": "plan",
//     "created": 1729978148,
//     "product": "prod_R6RDKB9hwXXPa4",
//     "currency": "usd",
//     "interval": "year",
//     "livemode": false,
//     "metadata": {},
//     "nickname": null,
//     "tiers_mode": null,
//     "usage_type": "licensed",
//     "amount_decimal": "19200",
//     "billing_scheme": "per_unit",
//     "interval_count": 1,
//     "aggregate_usage": null,
//     "transform_usage": null,
//     "trial_period_days": null
//   },
//   "items": {
//     "url": "/v1/subscription_items?subscription=sub_1QEHXuJfDYgxbs7ZdunDUELJ",
//     "data": [
//       {
//         "id": "si_R6UWDxTs2Q1byc",
//         "plan": {
//           "id": "price_1QEHXkJfDYgxbs7ZGdSor1jr",
//           "meter": null,
//           "active": false,
//           "amount": 19200,
//           "object": "plan",
//           "created": 1729978148,
//           "product": "prod_R6RDKB9hwXXPa4",
//           "currency": "usd",
//           "interval": "year",
//           "livemode": false,
//           "metadata": {},
//           "nickname": null,
//           "tiers_mode": null,
//           "usage_type": "licensed",
//           "amount_decimal": "19200",
//           "billing_scheme": "per_unit",
//           "interval_count": 1,
//           "aggregate_usage": null,
//           "transform_usage": null,
//           "trial_period_days": null
//         },
//         "price": {
//           "id": "price_1QEHXkJfDYgxbs7ZGdSor1jr",
//           "type": "recurring",
//           "active": false,
//           "object": "price",
//           "created": 1729978148,
//           "product": "prod_R6RDKB9hwXXPa4",
//           "currency": "usd",
//           "livemode": false,
//           "metadata": {},
//           "nickname": null,
//           "recurring": {
//             "meter": null,
//             "interval": "year",
//             "usage_type": "licensed",
//             "interval_count": 1,
//             "aggregate_usage": null,
//             "trial_period_days": null
//           },
//           "lookup_key": null,
//           "tiers_mode": null,
//           "unit_amount": 19200,
//           "tax_behavior": "unspecified",
//           "billing_scheme": "per_unit",
//           "custom_unit_amount": null,
//           "transform_quantity": null,
//           "unit_amount_decimal": "19200"
//         },
//         "object": "subscription_item",
//         "created": 1729978159,
//         "metadata": {},
//         "quantity": 1,
//         "discounts": [],
//         "tax_rates": [],
//         "subscription": "sub_1QEHXuJfDYgxbs7ZdunDUELJ",
//         "billing_thresholds": null
//       }
//     ],
//     "object": "list",
//     "has_more": false,
//     "total_count": 1
//   },
//   "object": "subscription",
//   "status": "canceled",
//   "created": 1729978158,
//   "currency": "usd",
//   "customer": "cus_R6R6ccVvhlnsyx",
//   "discount": null,
//   "ended_at": 1729979548,
//   "livemode": false,
//   "metadata": {},
//   "quantity": 1,
//   "schedule": null,
//   "cancel_at": null,
//   "discounts": [],
//   "trial_end": null,
//   "start_date": 1729978158,
//   "test_clock": null,
//   "application": null,
//   "canceled_at": 1729978249,
//   "description": null,
//   "trial_start": null,
//   "on_behalf_of": null,
//   "automatic_tax": {
//     "enabled": false,
//     "liability": null
//   },
//   "transfer_data": null,
//   "days_until_due": null,
//   "default_source": null,
//   "latest_invoice": "in_1QEHXuJfDYgxbs7Z73tSeGFG",
//   "pending_update": null,
//   "trial_settings": {
//     "end_behavior": {
//       "missing_payment_method": "create_invoice"
//     }
//   },
//   "invoice_settings": {
//     "issuer": {
//       "type": "self"
//     },
//     "account_tax_ids": null
//   },
//   "pause_collection": null,
//   "payment_settings": {
//     "payment_method_types": null,
//     "payment_method_options": {
//       "card": {
//         "network": null,
//         "request_three_d_secure": "automatic"
//       },
//       "konbini": null,
//       "acss_debit": null,
//       "bancontact": null,
//       "sepa_debit": null,
//       "us_bank_account": null,
//       "customer_balance": null
//     },
//     "save_default_payment_method": "off"
//   },
//   "collection_method": "charge_automatically",
//   "default_tax_rates": [],
//   "billing_thresholds": null,
//   "current_period_end": 1761514158,
//   "billing_cycle_anchor": 1729978158,
//   "cancel_at_period_end": false,
//   "cancellation_details": {
//     "reason": "cancellation_requested",
//     "comment": null,
//     "feedback": "unused"
//   },
//   "current_period_start": 1729978158,
//   "pending_setup_intent": null,
//   "default_payment_method": "pm_1QEHXtJfDYgxbs7ZkRALucKx",
//   "application_fee_percent": null,
//   "billing_cycle_anchor_config": null,
//   "pending_invoice_item_interval": null,
//   "next_pending_invoice_item_invoice": null
// }
