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

  console.log(customers.data);

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
