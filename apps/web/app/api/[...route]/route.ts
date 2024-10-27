import { Context, Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { handle } from "hono/vercel";
import { createClient } from "@/lib/server/supabase";
import { createId } from "@/lib/create-id";
import bcrypt from "bcrypt";
import { axiom, AXIOM_DATASETS } from "lib/axiom";
import {
  createOrRetrieveCustomer,
  createStripeClient,
} from "@/lib/server/stripe";
import { BASE_URL } from "@/lib/config";
import {
  isPricingPlanInterval,
  isPricingPlanTier,
  PRICING_PLANS,
  PricingPlanInterval,
  PricingPlanTier,
} from "@/lib/pricing.constants";

const UnauthorizedError = (c: Context) => {
  return c.json({ message: "Unauthorized" }, { status: 401 });
};

const BlogNotFoundError = (c: Context) => {
  return c.json({ message: "Blog not found" }, { status: 404 });
};

const ErrorRotatingAPIKey = (c: Context) => {
  return c.json({ message: "Error rotating API key" }, { status: 500 });
};

const errors = {
  UnauthorizedError,
  BlogNotFoundError,
  ErrorRotatingAPIKey,
};

const handleError = (c: Context, error: keyof typeof errors, rawLog: any) => {
  console.log("🔴", error);
  axiom.ingest(AXIOM_DATASETS.api, {
    message: error,
    error: true,
    blogId: c.req.param("blogId"),
    userId: c.req.param("userId"),
    method: c.req.method,
    path: c.req.url,
    rawLog,
  });

  return errors[error](c);
};

const getUser = async () => {
  const supabase = createClient();
  const res = await supabase.auth.getUser();

  return {
    user: res.data.user,
    error: res.error,
  };
};

const api = new Hono()
  // Rotates the API key for a blog
  .post("/blogs/:blogId/api-keys/rotate", async (c) => {
    const { user } = await getUser();
    const supabase = createClient();

    if (!user) {
      return UnauthorizedError(c);
    }

    // Check that the user is the owner of the blog
    const { data: blog, error: blogError } = await supabase
      .from("blogs")
      .select("id")
      .eq("id", c.req.param("blogId"))
      .eq("user_id", user?.id)
      .single();

    if (blogError || !blog) {
      return BlogNotFoundError(c);
    }

    // Create API key
    const newAPIKey = createId({ type: "blog", secret: true });
    const hashedAPIKey = await bcrypt.hash(newAPIKey, 10);

    const { data, error } = await supabase
      .from("blogs")
      .update({
        access_token: hashedAPIKey,
      })
      .eq("id", blog?.id);

    if (error) {
      console.log(error);
      return handleError(c, "ErrorRotatingAPIKey", error);
    }

    // Return the new API key to the client for use / storage
    return c.json({ message: "success", apiKey: newAPIKey }, 200);
  })
  .get(
    "/accounts/:user_id/checkout",
    zValidator(
      "query",
      z.object({
        plan: PricingPlanTier,
        interval: PricingPlanInterval,
      })
    ),
    async (c) => {
      try {
        const stripe = createStripeClient();
        const { user, error } = await getUser();
        const userId = c.req.param("user_id");
        const plan = c.req.query("plan");
        const interval = c.req.query("interval");

        if (error || !user || !user.email || !plan || !interval) {
          axiom.ingest(AXIOM_DATASETS.stripe, {
            message: "Error loading checkout session",
            payload: { userId, plan, error, user },
            error: true,
          });
          return c.json(
            {
              error: "Error loading checkout session. Please contact support.",
            },
            { status: 500 }
          );
        }

        if (!isPricingPlanTier(plan)) {
          return c.json({ error: "Invalid plan" }, { status: 400 });
        }
        if (!isPricingPlanInterval(interval)) {
          return c.json({ error: "Invalid interval" }, { status: 400 });
        }

        const customer = await createOrRetrieveCustomer({
          userId: user.id,
          email: user.email,
        });

        const selectedPlan = PRICING_PLANS.find((p) => p.id === plan);

        if (!selectedPlan) {
          return c.json({ error: "Invalid plan" }, { status: 400 });
        }

        const price =
          selectedPlan?.[interval === "month" ? "monthlyPrice" : "yearlyPrice"];

        const session = await stripe.checkout.sessions.create({
          customer: customer.id,
          mode: "subscription",
          allow_promotion_codes: true,
          success_url: `${BASE_URL}/account?success=true`,
          cancel_url: `${BASE_URL}/account?canceled=true`,
          line_items: [
            {
              quantity: 1,
              price_data: {
                product_data: {
                  name: selectedPlan.title,
                  description: selectedPlan.description,
                  metadata: {
                    plan_id: selectedPlan.id,
                    interval: interval,
                  },
                },
                currency: "usd",
                unit_amount: price * 100,
                recurring: {
                  interval,
                },
              },
            },
          ],
        });

        if (!session.url) {
          return c.json({ error: "Error creating session" }, { status: 500 });
        }

        console.log("session", session);

        return c.json({ url: session.url }, { status: 200 });
      } catch (error) {
        console.error(error);

        return c.json(
          { errorMessage: "Error creating session", error },
          { status: 500 }
        );
      }
    }
  )
  .get("/accounts/:user_id/customer-portal", async (c) => {
    try {
      const stripe = createStripeClient();
      const { user } = await getUser();

      if (!user) {
        return c.json({ error: "Unauthorized" }, { status: 401 });
      }

      if (!user.email) {
        return c.json({ error: "User email not found" }, { status: 400 });
      }

      const customer = await createOrRetrieveCustomer({
        userId: user.id,
        email: user.email,
      });

      const session = await stripe.billingPortal.sessions.create({
        customer: customer.id,
        return_url: process.env.NEXT_PUBLIC_BASE_URL + "/account",
      });

      return c.json({ url: session.url }, { status: 200 });
    } catch (error) {
      console.error(error);
      return c.json(
        { error: "Error creating customer portal" },
        { status: 500 }
      );
    }
  });

const app = new Hono()
  .basePath("/api")
  // MIDDLEWARE
  .use("*", logger())
  .use("*", prettyJSON())
  .use("*", async (c, next) => {
    const start = Date.now();
    await next();
    const duration = Date.now() - start;
    axiom.ingest(AXIOM_DATASETS.api, {
      message: "Request completed",
      duration,
      method: c.req.method,
      path: c.req.url,
      status: c.res.status,
    });
  })
  // ROUTES
  .route("/v2", api);

export type ManagementAPI = typeof app;

export const OPTIONS = handle(app);
export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
