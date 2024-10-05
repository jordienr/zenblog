import { Context, Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { handle } from "hono/vercel";
import { createClient } from "@/lib/server/supabase";
import { createId } from "@/lib/create-id";
export const dynamic = "force-dynamic";
import bcrypt from "bcrypt";
import { axiom } from "lib/axiom";

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
  axiom.ingest("api", {
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
    axiom.ingest("api", {
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
