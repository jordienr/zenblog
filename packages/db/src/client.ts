import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { schema } from "./schema";

const DEFAULT_DATABASE_URL =
  "postgres://postgres:postgres@localhost:5432/zenblog";

export function getDatabaseUrl() {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    DEFAULT_DATABASE_URL
  );
}

export function createSqlClient(connectionString = getDatabaseUrl()) {
  return postgres(connectionString, {
    prepare: false,
    max: 1,
  });
}

export function createDb(connectionString = getDatabaseUrl()) {
  const client = createSqlClient(connectionString);
  return drizzle(client, { schema });
}

export type DbClient = ReturnType<typeof createDb>;
