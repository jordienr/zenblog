import Stripe from "stripe";

export function createStripeClient() {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    throw new Error("Error getting stripe key.");
  }

  return new Stripe(stripeKey);
}

export async function createOrRetrieveCustomer({
  userId,
  email,
}: {
  userId: string;
  email: string;
}): Promise<Stripe.Customer> {
  const stripe = createStripeClient();

  const customers = await stripe.customers.search({
    query: "metadata['userId']:'" + userId + "'",
  });

  if (customers.data.length > 0) {
    const customer = customers.data[0];

    if (!customer) {
      throw new Error("Error retrieving customer");
    }

    return customer;
  } else {
    const newCustomer = await stripe.customers.create({
      email,
      metadata: {
        userId,
      },
    });

    return newCustomer;
  }
}

export async function getPriceIdByLookupKey(
  lookupKey: string | undefined
): Promise<string | null> {
  const stripe = createStripeClient();

  if (!lookupKey) {
    // Just return null, could be a cancelled subscription
    return null;
  }

  const r = await stripe.prices.list({
    lookup_keys: [lookupKey],
    active: true,
    limit: 1,
  });
  if (!r.data[0]) throw new Error(`No price for lookup_key=${lookupKey}`);
  return r.data[0].id;
}
