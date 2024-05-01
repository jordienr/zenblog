import { NextApiHandler } from "next";
import { getServerClient } from "@/lib/server/deprecated/supabase";
import {
  createOrRetrieveCustomer,
  createStripeClient,
} from "@/lib/server/stripe";
import { BASE_URL } from "@/lib/config";

const handler: NextApiHandler = async (req, res) => {
  try {
    const stripe = createStripeClient();
    const { user } = await getServerClient(req, res);
    const price_id = req.body.price_id;

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
