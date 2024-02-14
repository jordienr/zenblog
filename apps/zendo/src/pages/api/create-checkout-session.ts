import { NextApiHandler } from "next";
import { getServerClient } from "@/lib/server/deprecated/supabase";
import {
  createOrRetrieveCustomer,
  createStripeClient,
} from "@/lib/server/stripe";
import { STRIPE_CONSTANTS } from "@/lib/server/stripe.constants";

const handler: NextApiHandler = async (req, res) => {
  try {
    const stripe = createStripeClient();
    const { user } = await getServerClient(req, res);

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!user.email) {
      return res.status(400).json({ error: "User email not found" });
    }

    const customer = await createOrRetrieveCustomer({
      userId: user.id,
      email: user.email,
    });

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      line_items: [
        {
          price: STRIPE_CONSTANTS.products.proPlan.yearlyPriceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      allow_promotion_codes: true,
      success_url: `http://localhost:3000/account?success=true`,
      cancel_url: `http://localhost:3000/account?canceled=true`,
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
