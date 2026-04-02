import { sql } from "drizzle-orm";
import { createDb } from "../src/client";

async function main() {
  const db = createDb();

  await db.execute(sql`drop schema if exists drizzle cascade`);
  await db.execute(sql`create schema if not exists drizzle`);

  console.log("Reset helper completed. Re-run migrations with npm run db:migrate.");
}

main().catch((error) => {
  console.error("Reset helper failed");
  console.error(error);
  process.exit(1);
});
