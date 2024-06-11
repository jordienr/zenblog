import { NextApiHandler } from "next";
import {
  createOrRetrieveCustomer,
  createStripeClient,
} from "@/lib/server/stripe";
import { BASE_URL } from "@/lib/config";
import { createClient } from "app/supa";

const handler: NextApiHandler = async (req, res) => {
  return;
  try {
    const stripe = createStripeClient();
    const supa = createClient();
    const jwt = req.headers.authorization?.replace("Bearer ", "");
    console.log(jwt);
    const {
      data: { user },
      error,
    } = await supa.auth.getUser(jwt);
    const price_id = req.body.price_id;

    console.log(user);

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!user.email) {
      return res.status(400).json({ error: "User email not found" });
    }

    if (!price_id) {
      return res.status(400).json({ error: "Product id not found" });
    }

    const customer = await createOrRetrieveCustomer({
      userId: user.id,
      email: user.email,
    });

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      line_items: [
        {
          price: price_id,
          quantity: 1,
        },
      ],
      mode: "subscription",
      allow_promotion_codes: true,
      success_url: `${BASE_URL}/account?success=true`,
      cancel_url: `${BASE_URL}/account?canceled=true`,
    });

    if (!session.url) {
      return res.status(500).json({ error: "Error creating session" });
    }

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error(error);

    res.status(500).json({ errorMessage: "Error creating session", error });
  }
};

export default handler;
