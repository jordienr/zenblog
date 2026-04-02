import {
  bigint,
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  pgView,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const blogSortOrder = pgEnum("blog_sort_order", [
  "desc",
  "asc",
]);

export const mediaStatus = pgEnum("media_status", [
  "pending",
  "uploaded",
  "failed",
]);

export const blogs = pgTable("blogs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  emoji: text("emoji").notNull(),
  slug: text("slug"),
  theme: text("theme").notNull().default("default"),
  accessToken: text("access_token"),
  active: boolean("active").notNull().default(true),
  twitter: text("twitter").notNull().default(""),
  instagram: text("instagram").notNull().default(""),
  website: text("website").notNull().default(""),
  order: blogSortOrder("order").notNull().default("desc"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const categories = pgTable("categories", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  blogId: uuid("blog_id")
    .notNull()
    .references(() => blogs.id),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const tags = pgTable("tags", {
  id: uuid("id").defaultRandom().primaryKey(),
  blogId: uuid("blog_id")
    .notNull()
    .references(() => blogs.id),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const authors = pgTable("authors", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  blogId: uuid("blog_id")
    .notNull()
    .references(() => blogs.id),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  imageUrl: text("image_url"),
  bio: text("bio"),
  twitter: text("twitter"),
  website: text("website"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const posts = pgTable("posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  blogId: uuid("blog_id")
    .notNull()
    .references(() => blogs.id),
  userId: uuid("user_id").notNull(),
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  excerpt: text("excerpt").notNull().default(""),
  content: jsonb("content").notNull().default(sql`'{}'::jsonb`),
  htmlContent: text("html_content").notNull().default(""),
  meta: jsonb("meta"),
  metadata: jsonb("metadata").$type<unknown[]>(),
  coverImage: text("cover_image"),
  categoryId: integer("category_id").references(() => categories.id),
  published: boolean("published").notNull().default(false),
  deleted: boolean("deleted").notNull().default(false),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const postTags = pgTable("post_tags", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  blogId: uuid("blog_id")
    .notNull()
    .references(() => blogs.id),
  postId: uuid("post_id")
    .notNull()
    .references(() => posts.id),
  tagId: uuid("tag_id")
    .notNull()
    .references(() => tags.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const postAuthors = pgTable("post_authors", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  blogId: uuid("blog_id")
    .notNull()
    .references(() => blogs.id),
  postId: uuid("post_id")
    .notNull()
    .references(() => posts.id),
  authorId: integer("author_id")
    .notNull()
    .references(() => authors.id),
});

export const blogImages = pgTable("blog_images", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  blogId: uuid("blog_id")
    .notNull()
    .references(() => blogs.id),
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url"),
  sizeInBytes: integer("size_in_bytes").notNull().default(0),
  contentType: text("content_type"),
  uploadStatus: mediaStatus("upload_status").default("uploaded"),
  isVideo: boolean("is_video").default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const subscriptions = pgTable("subscriptions", {
  userId: uuid("user_id").primaryKey(),
  stripeSubscriptionId: text("stripe_subscription_id").notNull(),
  plan: text("plan"),
  status: text("status").notNull(),
  subscription: jsonb("subscription").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const products = pgTable("products", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  stripeProductId: text("stripe_product_id").notNull(),
  product: jsonb("product").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const prices = pgTable("prices", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  stripePriceId: text("stripe_price_id").notNull(),
  price: jsonb("price").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const feedback = pgTable("feedback", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  type: text("type").notNull(),
  feedback: text("feedback"),
  userEmail: text("user_email"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const homepageSignup = pgTable("homepage_signup", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  invited: boolean("invited").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const onboardingSteps = pgTable("onboarding_steps", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  userId: uuid("user_id").notNull(),
  hasBlog: boolean("has_blog").notNull().default(false),
  hasIntegratedApi: boolean("has_integrated_api").notNull().default(false),
  hasPublishedPost: boolean("has_published_post").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const apiKeys = pgTable("api_keys", {
  id: uuid("id").defaultRandom().primaryKey(),
  blogId: uuid("blog_id")
    .notNull()
    .references(() => blogs.id),
  name: varchar("name", { length: 255 }).notNull(),
  keyHash: text("key_hash").notNull(),
  lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
});

export const apiKeyScopes = pgTable("api_key_scopes", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  apiKeyId: uuid("api_key_id")
    .notNull()
    .references(() => apiKeys.id),
  scope: varchar("scope", { length: 255 }).notNull(),
});

export const apiRequestAuditLog = pgTable("api_request_audit_log", {
  id: bigint("id", { mode: "number" }).generatedAlwaysAsIdentity().primaryKey(),
  apiKeyId: uuid("api_key_id").references(() => apiKeys.id),
  blogId: uuid("blog_id").references(() => blogs.id),
  path: text("path").notNull(),
  method: varchar("method", { length: 16 }).notNull(),
  statusCode: integer("status_code").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const categoryPostCount = pgView("category_post_count", {
  blogId: uuid("blog_id"),
  categoryId: integer("category_id"),
  categoryName: text("category_name"),
  categorySlug: text("category_slug"),
  createdAt: timestamp("created_at", { withTimezone: true }),
  postCount: bigint("post_count", { mode: "number" }),
}).existing();

export const postsV10 = pgView("posts_v10", {
  blogId: uuid("blog_id"),
  title: text("title"),
  slug: text("slug"),
  excerpt: text("excerpt"),
  htmlContent: text("html_content"),
  content: jsonb("content"),
  coverImage: text("cover_image"),
  categoryName: text("category_name"),
  categorySlug: text("category_slug"),
  tags: text("tags").array(),
  authors: integer("authors").array(),
  metadata: jsonb("metadata").$type<unknown[]>(),
  published: boolean("published"),
  deleted: boolean("deleted"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
  subscriptionStatus: text("subscription_status"),
}).existing();

export const tagUsageCountV2 = pgView("tag_usage_count_v2", {
  blogId: uuid("blog_id"),
  tagId: uuid("tag_id"),
  tagName: text("tag_name"),
  slug: text("slug"),
  postCount: bigint("post_count", { mode: "number" }),
  createdAt: timestamp("created_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
}).existing();

export const schema = {
  blogs,
  categories,
  tags,
  authors,
  posts,
  postTags,
  postAuthors,
  blogImages,
  subscriptions,
  products,
  prices,
  feedback,
  homepageSignup,
  onboardingSteps,
  apiKeys,
  apiKeyScopes,
  apiRequestAuditLog,
  categoryPostCount,
  postsV10,
  tagUsageCountV2,
};

export type DatabaseSchema = typeof schema;
