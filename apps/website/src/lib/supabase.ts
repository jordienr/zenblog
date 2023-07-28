import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import { env } from "@/env.mjs";

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseKey) {
  throw new Error("Missing supabaseKey");
}

export function getClient(supabaseAccessToken?: string) {
  if (!supabaseKey) {
    throw new Error("Missing supabaseKey");
  }

  if (supabaseAccessToken) {
    const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          Authorization: `Bearer ${supabaseAccessToken}`,
        },
      },
      auth: {
        persistSession: false,
      },
    });

    return supabase;
  } else {
    const supabase = createClient<Database>(supabaseUrl, supabaseKey);

    return supabase;
  }
}
