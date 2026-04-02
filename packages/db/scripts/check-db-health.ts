import { sql } from "drizzle-orm";
import { createDb } from "../src/client";
import { postsV10 } from "../src/schema";

async function main() {
  const db = createDb();

  await db.execute(sql`select 1`);
  await db.select().from(postsV10).limit(1);

  console.log("Database health check passed");
}

main().catch((error) => {
  console.error("Database health check failed");
  console.error(error);
  process.exit(1);
});
