import { Database } from "@/types/supabase";
import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE;

  if (!url || !key) {
    throw new Error("Missing env variables for Supabase");
  }

  const client = createClient<Database>(url, key);

  return client;
}
