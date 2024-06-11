import {
  createOrRetrieveCustomer,
  createStripeClient,
} from "@/lib/server/stripe";
import { BASE_URL } from "@/lib/config";
import { createClient } from "app/supa";
import { type NextRequest, NextResponse as res } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const stripe = createStripeClient();
    const supa = createClient();

    const {
      data: { user },
      error,
    } = await supa.auth.getUser();

    if (error) {
      console.error(error);
      return res.json({ error: "Error loading user" }, { status: 500 });
    }

    console.log("user --->>>", user?.email);

    const bodyJson = await req.json();
    const price_id = bodyJson.price_id;

    console.log(user?.email, price_id);

    if (!user) {
      return res.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!user.email) {
      return res.json({ error: "User email not found" }, { status: 400 });
    }

    if (!price_id) {
      return res.json({ error: "Product id not found" }, { status: 400 });
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
      return res.json({ error: "Error creating session" }, { status: 500 });
    }

    return res.json({ url: session.url }, { status: 200 });
  } catch (error) {
    console.error(error);

    return res.json(
      { errorMessage: "Error creating session", error },
      { status: 500 }
    );
  }
}
