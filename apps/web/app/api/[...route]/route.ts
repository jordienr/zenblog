import { Context, Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { handle } from "hono/vercel";
import { createClient } from "@/lib/server/supabase";
import { createId } from "@/lib/create-id";
import bcrypt from "bcrypt";
import { axiom, AXIOM_DATASETS, getApiUsageForBlog } from "lib/axiom";
import {
  createOrRetrieveCustomer,
  createStripeClient,
} from "@/lib/server/stripe";
import { BASE_URL } from "@/lib/config";
import {
  isPricingPlanInterval,
  isPricingPlanId,
  PRICING_PLANS,
  PricingPlanInterval,
  PricingPlanId,
  TRIAL_PERIOD_DAYS,
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
  .get(
    "/accounts/:user_id/checkout",
    zValidator(
      "query",
      z.object({
        plan: PricingPlanId,
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
          console.log("🔴 error", error, user, plan, interval);
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

        if (!isPricingPlanId(plan)) {
          console.log("🔴 !isPricingPlanId", plan);
          return c.json({ error: "Invalid plan" }, { status: 400 });
        }

        if (!isPricingPlanInterval(interval)) {
          console.log("🔴 !isPricingPlanInterval", interval);
          return c.json({ error: "Invalid interval" }, { status: 400 });
        }

        const customer = await createOrRetrieveCustomer({
          userId: user.id,
          email: user.email,
        });

        const selectedPlan = PRICING_PLANS.find((p) => p.id === plan);

        if (!selectedPlan) {
          console.log("🔴 !selectedPlan", selectedPlan);
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
          subscription_data: {
            trial_period_days: TRIAL_PERIOD_DAYS,
            metadata: {
              plan_id: selectedPlan.id,
            },
          },
          line_items: [
            {
              quantity: 1,
              price_data: {
                product_data: {
                  name: selectedPlan.title,
                  description: selectedPlan.description,
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
          console.log("🔴 !session.url", session.url);
          return c.json({ error: "Error creating session" }, { status: 500 });
        }

        console.log("session", session);

        return c.json({ url: session.url }, { status: 200 });
      } catch (error) {
        console.log("🔴 error", error);
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
  })
  .get(
    "/blogs/:blog_id/usage",
    zValidator(
      "query",
      z.object({
        start_time: z.string(),
        end_time: z.string(),
      })
    ),
    async (c) => {
      const blogId = c.req.param("blog_id");
      const startTime = c.req.query("start_time");
      const endTime = c.req.query("end_time");

      if (!blogId || !startTime || !endTime) {
        return c.json({ error: "Missing parameters" }, { status: 400 });
      }
      console.log("🥬 all good so far");

      const res = await getApiUsageForBlog(blogId, startTime, endTime);
      console.log("🥬 res", res);

      return c.json(res);
    }
  );

const app = new Hono()
  .basePath("/api")
  // MIDDLEWARE
  .use("*", logger())
  .use("*", prettyJSON())
  // ROUTES
  .route("/v2", api);

export type ManagementAPI = typeof app;

export const OPTIONS = handle(app);
export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
