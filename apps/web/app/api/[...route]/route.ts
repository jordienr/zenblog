import { Context, Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { handle } from "hono/vercel";
import { createClient } from "@/lib/server/supabase";
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
import sharp from "sharp";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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

const getBlogOwnership = async (blogId: string, userId: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("blogs")
    .select("user_id")
    .eq("id", blogId)
    .single();

  if (error || !data) {
    return false;
  }

  return data.user_id === userId;
};

const createR2Client = () => {
  return new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
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
  )
  .get(
    "/blogs/:blog_id/media/upload-url",
    zValidator(
      "query",
      z.object({
        original_file_name: z.string(),
        size_in_bytes: z.coerce.number(),
        content_type: z.string(),
      })
    ),
    async (c) => {
      const MAX_FREE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB - Define limit on backend
      const blogId = c.req.param("blog_id");
      const { user } = await getUser();
      const { original_file_name, size_in_bytes, content_type } = c.req.query();

      if (!user || !user.id) {
        return c.json({ error: "Unauthorized" }, { status: 401 });
      }

      if (!original_file_name || !size_in_bytes || !content_type) {
        return c.json({ error: "Missing parameters" }, { status: 400 });
      }

      const isOwner = await getBlogOwnership(blogId, user.id);

      if (!isOwner) {
        return c.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Fetch user's subscription plan
      const supabase = createClient();
      const { data: subscriptionData, error: subError } = await supabase
        .from("subscriptions")
        .select("plan, status")
        .eq("user_id", user.id)
        .in("status", ["active", "trialing", "past_due"]) // Check for valid statuses
        .maybeSingle(); // Use maybeSingle as user might not have a subscription row

      if (subError) {
        console.error(
          "🔴 Error fetching subscription for size check:",
          subError
        );
        // Fail safe - potentially deny or allow based on policy?
        // For now, let's return an internal error.
        return c.json(
          { error: "Could not verify subscription status" },
          { status: 500 }
        );
      }

      // Use 'plan' from subscription data
      const userPlan = subscriptionData?.plan || "free";
      const isProPlan = userPlan === "pro"; // Replace 'pro' if needed

      // Ensure size_in_bytes is treated as number for comparison
      if (!isProPlan && Number(size_in_bytes) > MAX_FREE_SIZE_BYTES) {
        console.log(
          `🚫 User ${user.id} on plan '${userPlan}' exceeded size limit: ${size_in_bytes} > ${MAX_FREE_SIZE_BYTES}`
        );
        return c.json(
          // Ensure size_in_bytes is treated as number for calculation
          {
            error: `File size (${(
              Number(size_in_bytes) /
              (1024 * 1024)
            ).toFixed(
              1
            )}MB) exceeds 5MB limit for your current plan. Upgrade to Pro for larger uploads.`,
          },
          { status: 400 } // Use 400 Bad Request or 413 Payload Too Large
        );
      }

      const fileExtension = original_file_name.split(".").pop() || "";
      const baseName = original_file_name
        .replace(/\.[^/.]+$/, "") // Remove extension
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-") // Replace non-alphanumeric with hyphens
        .replace(/-+/g, "-") // Replace multiple hyphens with single
        .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
      const timestamp = Date.now().toString().slice(-6);
      const uniqueFilename = `${baseName}-${timestamp}${
        fileExtension ? "." + fileExtension : ""
      }`;

      const { error: dbError } = await supabase.from("blog_images").insert({
        blog_id: blogId,
        file_name: uniqueFilename,
        size_in_bytes: Number(size_in_bytes),
        content_type: content_type,
        upload_status: "pending",
        is_video: content_type.startsWith("video/"),
      });

      if (dbError) {
        console.error("🔴 dbError inserting pending record:", dbError);
        return c.json(
          { error: "Error storing file metadata" },
          { status: 500 }
        );
      }

      const r2 = createR2Client();
      const command = new PutObjectCommand({
        Bucket: process.env.R2_IMAGES_BUCKET_NAME,
        Key: uniqueFilename,
        ContentType: content_type,
        Metadata: {
          "original-filename": original_file_name,
          "user-id": user.id,
        },
      });

      try {
        const signedUrl = await getSignedUrl(r2, command, {
          expiresIn: 60 * 15,
        });
        return c.json({ signedUrl, uniqueFilename }, { status: 200 });
      } catch (signError) {
        console.error("🔴 Error generating signed URL:", signError);
        await supabase
          .from("blog_images")
          .delete()
          .match({ blog_id: blogId, file_name: uniqueFilename });
        return c.json(
          { error: "Error generating upload URL" },
          { status: 500 }
        );
      }
    }
  )
  .post(
    "/blogs/:blog_id/images",
    zValidator(
      "query",
      z.object({
        isVideo: z.string().optional(),
        convertToWebp: z.string().optional(),
        imageName: z.string().optional(),
      })
    ),
    zValidator(
      "form",
      z.object({
        image: z.instanceof(File),
      })
    ),
    async (c) => {
      try {
        const blogId = c.req.param("blog_id");

        // Check if the user owns the blog
        const { user } = await getUser();
        if (!user || !user.id) {
          console.log("🔴 !user || !user.id", user);
          return c.json({ error: "Unauthorized" }, { status: 401 });
        }

        const isOwner = await getBlogOwnership(blogId, user.id);

        if (!isOwner) {
          console.log("🔴 !isOwner", user.id, blogId);
          return c.json({ error: "Unauthorized" }, { status: 401 });
        }

        const convertToWebp = c.req.query("convertToWebp") === "true";
        const isVideo = c.req.query("isVideo") === "true";
        const providedName = c.req.query("imageName");

        // Get the file from the request
        const formData = await c.req.formData();
        const file = formData.get("image") as File;

        if (!file) {
          return c.json({ error: "No file provided" }, { status: 400 });
        }

        // Convert file to buffer
        const buffer = Buffer.from(await file.arrayBuffer());
        let processedBuffer: Buffer;
        let contentType: string;
        let fileExtension: string;

        if (isVideo) {
          // For videos, we don't process with Sharp
          processedBuffer = buffer;
          contentType = file.type;
          fileExtension = file.name.split(".").pop() || "mp4";
        } else {
          // Process image with Sharp
          let imageProcessor = sharp(buffer)
            .resize(2560, 2560, {
              // Max dimensions
              fit: "inside",
              withoutEnlargement: true, // Don't upscale
            })
            .jpeg({ quality: 80 }); // Compress

          if (convertToWebp) {
            imageProcessor = imageProcessor.webp({ quality: 80 });
          }

          processedBuffer = await imageProcessor.toBuffer();
          contentType = convertToWebp ? "image/webp" : "image/jpeg";
          fileExtension = convertToWebp ? "webp" : "jpg";
        }

        // Upload to R2
        const r2 = createR2Client();
        const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
        const baseName = providedName
          ? providedName
              .toLowerCase()
              .replace(/[^a-z0-9]/g, "-") // Replace non-alphanumeric with hyphens
              .replace(/-+/g, "-") // Replace multiple hyphens with single
              .replace(/^-|-$/g, "") // Remove leading/trailing hyphens
          : isVideo
          ? "video"
          : "image";

        const fileName = `${baseName}-${timestamp}.${fileExtension}`;

        try {
          await r2.send(
            new PutObjectCommand({
              Bucket: process.env.R2_IMAGES_BUCKET_NAME,
              Key: fileName,
              Body: processedBuffer,
              ContentType: contentType,
              Metadata: {
                blog_id: blogId,
                uploaded_at: new Date().toISOString(),
                is_video: isVideo.toString(),
              },
            })
          );

          // Construct the public URL
          const publicUrl = `https://${process.env.R2_PUBLIC_DOMAIN}/${fileName}`;

          // Insert record into blog_images table
          const supabase = createClient();
          const { error: dbError } = await supabase.from("blog_images").insert({
            blog_id: blogId,
            file_name: fileName,
            file_url: publicUrl,
            size_in_bytes: processedBuffer.length,
            content_type: contentType,
            is_video: isVideo,
          });

          if (dbError) {
            console.error("Database insert error:", dbError);
            // Attempt to clean up the R2 upload
            try {
              await r2.send(
                new DeleteObjectCommand({
                  Bucket: process.env.R2_IMAGES_BUCKET_NAME,
                  Key: fileName,
                })
              );
              return c.json(
                { error: "Failed to save image metadata" },
                { status: 500 }
              );
            } catch (deleteError) {
              // Log both errors for investigation
              console.error("Failed to delete orphaned R2 image:", deleteError);
              axiom.ingest(AXIOM_DATASETS.api, {
                message: "Orphaned R2 image",
                fileName,
                blogId,
                dbError,
                deleteError,
                error: true,
              });
              return c.json(
                { error: "Failed to process image completely" },
                { status: 500 }
              );
            }
          }

          return c.json(
            {
              url: publicUrl,
              fileName: fileName,
            },
            { status: 200 }
          );
        } catch (error) {
          console.error("R2 upload error:", error);
          return c.json({ error: "Failed to upload image" }, { status: 500 });
        }
      } catch (error) {
        console.error("Image upload error:", error);
        return c.json(
          { error: "Error processing or uploading image" },
          { status: 500 }
        );
      }
    }
  )
  .delete(
    "/blogs/:blog_id/images",
    zValidator(
      "json",
      z.object({
        fileNames: z.array(z.string()),
      })
    ),
    async (c) => {
      try {
        const blogId = c.req.param("blog_id");
        const { fileNames } = await c.req.json();

        // Check if the user owns the blog
        const { user } = await getUser();
        if (!user || !user.id) {
          return c.json({ error: "Unauthorized" }, { status: 401 });
        }

        const isOwner = await getBlogOwnership(blogId, user.id);
        if (!isOwner) {
          return c.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Re-added: Delete from Supabase DB first, matching on file_name
        const supabase = createClient();
        const { error: dbError } = await supabase
          .from("blog_images")
          .delete()
          // Match on blog_id and the specific file names (R2 keys)
          .eq("blog_id", blogId)
          .in("file_name", fileNames);

        if (dbError) {
          console.error("Database delete error:", dbError);
          // Log error, but maybe proceed to R2 deletion attempt anyway?
          // For now, we stop if DB delete fails.
          axiom.ingest(AXIOM_DATASETS.api, {
            message: "Failed to delete image metadata from DB",
            blogId,
            fileNames,
            dbError,
            error: true,
          });
          return c.json(
            { error: "Failed to delete image metadata" },
            { status: 500 }
          );
        }

        // Delete from R2
        const r2 = createR2Client();
        const deleteErrors: { fileName: string; error: unknown }[] = [];

        // Process deletions in parallel
        await Promise.all(
          fileNames.map(async (fileName: string) => {
            try {
              await r2.send(
                new DeleteObjectCommand({
                  Bucket: process.env.R2_IMAGES_BUCKET_NAME,
                  Key: fileName,
                })
              );
            } catch (r2Error) {
              console.error("R2 delete error:", r2Error);
              deleteErrors.push({ fileName, error: r2Error });
            }
          })
        );

        if (deleteErrors.length > 0) {
          axiom.ingest(AXIOM_DATASETS.api, {
            message: "Failed to delete some R2 images",
            blogId,
            error: true,
            deleteErrors,
          });
          return c.json(
            {
              error: "Failed to delete some images from storage",
              deleteErrors,
            },
            { status: 500 }
          );
        }

        return c.json(
          { message: "Images deleted successfully" },
          { status: 200 }
        );
      } catch (error) {
        console.error("Image deletion error:", error);
        return c.json({ error: "Error deleting images" }, { status: 500 });
      }
    }
  )
  .post(
    "/blogs/:blog_id/authors",
    zValidator(
      "form",
      z.object({
        name: z.string(),
        slug: z.string(),
        image: z.instanceof(File).optional(),
        twitter: z.string().optional(),
        website: z.string().optional(),
        bio: z.string().optional(),
      })
    ),
    async (c) => {
      console.log("🥬 CREATING AUTHOR---", c.req.formData());

      const blogId = c.req.param("blog_id");
      const formData = await c.req.formData();
      const name = formData.get("name") as string;
      const image = formData.get("image") as File | null;
      const slug = formData.get("slug") as string;
      const twitter = formData.get("twitter") as string;
      const website = formData.get("website") as string;
      const bio = formData.get("bio") as string;
      const { user } = await getUser();

      if (!user || !user.id) {
        return c.json({ error: "Unauthorized" }, { status: 401 });
      }

      const isOwner = await getBlogOwnership(blogId, user.id);

      if (!isOwner) {
        return c.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Upload author image to R2 if exists
      // validate slug is url friendly
      // Create author in supabase

      const r2 = createR2Client();

      let imageUrl = "";

      if (image) {
        const buffer = Buffer.from(await image.arrayBuffer());
        const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
        const fileName = `${slug}-${timestamp}.${image.type.split("/")[1]}`;
        await r2.send(
          new PutObjectCommand({
            Bucket: process.env.R2_IMAGES_BUCKET_NAME,
            Key: `authors/${fileName}`,
            Body: buffer,
            ContentType: image.type,
            Metadata: {
              blog_id: blogId,
              uploaded_at: new Date().toISOString(),
              name,
              slug,
            },
          })
        );

        imageUrl = `https://${process.env.R2_PUBLIC_DOMAIN}/authors/${fileName}`;
      }

      const supabase = createClient();
      const { error } = await supabase.from("authors").insert({
        name,
        blog_id: blogId,
        slug,
        image_url: imageUrl,
        twitter,
        website,
        bio,
      });

      if (error) {
        console.error("Database insert error:", error);
        return c.json({ error: "Failed to create author" }, { status: 500 });
      }

      return c.json({ message: "Author created" }, { status: 200 });
    }
  )
  .patch(
    "/blogs/:blog_id/authors/:author_slug",
    zValidator(
      "form",
      z.object({
        name: z.string().optional(),
        slug: z.string().optional(),
        image: z.instanceof(File).optional(),
        twitter: z.string().optional(),
        website: z.string().optional(),
        bio: z.string().optional(),
      })
    ),
    async (c) => {
      const blogId = c.req.param("blog_id");
      const authorSlug = c.req.param("author_slug");
      const formData = await c.req.formData();

      // Check authorization
      const { user } = await getUser();
      if (!user || !user.id) {
        return c.json({ error: "Unauthorized" }, { status: 401 });
      }

      const isOwner = await getBlogOwnership(blogId, user.id);
      if (!isOwner) {
        return c.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Handle image upload if provided
      const image = formData.get("image") as File | null;
      let imageUrl: string | undefined;

      if (image && image.size > 0) {
        const r2 = createR2Client();
        const buffer = Buffer.from(await image.arrayBuffer());
        const timestamp = Date.now().toString().slice(-6);
        const fileName = `${authorSlug}-${timestamp}.${
          image.type.split("/")[1]
        }`;

        await r2.send(
          new PutObjectCommand({
            Bucket: process.env.R2_IMAGES_BUCKET_NAME,
            Key: `authors/${fileName}`,
            Body: buffer,
            ContentType: image.type,
            Metadata: {
              blog_id: blogId,
              uploaded_at: new Date().toISOString(),
              slug: authorSlug,
            },
          })
        );

        imageUrl = `https://${process.env.R2_PUBLIC_DOMAIN}/authors/${fileName}`;
      }

      // Prepare update data
      const updateData: Record<string, any> = {};
      if (formData.get("name")) updateData.name = formData.get("name");
      if (formData.get("slug")) updateData.slug = formData.get("slug");
      if (formData.get("twitter")) updateData.twitter = formData.get("twitter");
      if (formData.get("website")) updateData.website = formData.get("website");
      if (formData.get("bio")) updateData.bio = formData.get("bio");
      if (imageUrl) updateData.image_url = imageUrl;

      // Update author in database
      const supabase = createClient();
      const { error } = await supabase
        .from("authors")
        .update(updateData)
        .match({ blog_id: blogId, slug: authorSlug });

      if (error) {
        console.error("Database update error:", error);
        return c.json({ error: "Failed to update author" }, { status: 500 });
      }

      return c.json({ message: "Author updated" }, { status: 200 });
    }
  )
  .post(
    "/blogs/:blog_id/media/confirm-upload",
    zValidator(
      "json",
      z.object({
        fileName: z.string(), // The final name/key of the file in R2
        contentType: z.string(),
        sizeInBytes: z.number(),
      })
    ),
    async (c) => {
      const blogId = c.req.param("blog_id");
      const { fileName, contentType, sizeInBytes } = await c.req.json();
      const { user } = await getUser();

      if (!user || !user.id) {
        return c.json({ error: "Unauthorized" }, { status: 401 });
      }

      const isOwner = await getBlogOwnership(blogId, user.id);
      if (!isOwner) {
        return c.json({ error: "Unauthorized" }, { status: 401 });
      }

      // TODO: Optionally add R2 HeadObjectCommand check here to verify file existence

      const supabase = createClient();
      const publicUrl = `https://${process.env.R2_PUBLIC_DOMAIN}/${fileName}`;

      // Update the existing pending record
      const { error: updateError } = await supabase
        .from("blog_images")
        .update({
          upload_status: "uploaded",
          file_url: publicUrl,
          file_name: fileName,
          content_type: contentType,
          size_in_bytes: sizeInBytes,
          is_video: contentType.startsWith("video/"),
        })
        .match({
          blog_id: blogId,
          file_name: fileName,
          upload_status: "pending",
        });

      if (updateError) {
        console.error("Database update error on confirm:", updateError);
        // If the update failed, maybe the record wasn't 'pending' or didn't exist?
        // Consider adding cleanup logic for R2 object if needed
        axiom.ingest(AXIOM_DATASETS.api, {
          message: "Failed to confirm upload in DB",
          fileName,
          blogId,
          userId: user.id,
          updateError,
          error: true,
        });
        return c.json({ error: "Failed to confirm upload" }, { status: 500 });
      }

      return c.json(
        { message: "Upload confirmed", url: publicUrl },
        { status: 200 }
      );
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
