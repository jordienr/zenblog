import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import { env } from "@/env.mjs";

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("SUPABASE URL -> -> ", supabaseUrl);

if (!supabaseKey) {
  throw new Error("Missing supabaseKey");
}

export function getClientClient() {
  console.log("SUPABASE URL -> -> ", supabaseUrl);

  if (!supabaseKey) {
    throw new Error("Missing supabaseKey");
  }
  const supabase = createClient<Database>(supabaseUrl, supabaseKey);

  return supabase;
}
