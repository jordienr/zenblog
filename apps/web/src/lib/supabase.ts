import type { Database } from "@/types/supabase";
import { env } from "@/env.mjs";
import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseKey) {
  throw new Error("Missing supabaseKey");
}

export function createSupabaseBrowserClient() {
  if (!supabaseKey) {
    throw new Error("Missing supabaseKey");
  }
  const supabase = createBrowserClient<Database>(supabaseUrl, supabaseKey);

  return supabase;
}
