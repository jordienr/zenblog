import type { Config } from "drizzle-kit";

const databaseUrl =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_PRISMA_URL;

if (!databaseUrl) {
  console.warn(
    "[drizzle] DATABASE_URL is not set. Commands that require a database connection will fail."
  );
}

export default {
  schema: "./packages/db/src/schema.ts",
  out: "./packages/db/drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl || "postgres://postgres:postgres@localhost:5432/zenblog",
  },
  strict: true,
  verbose: true,
} satisfies Config;
