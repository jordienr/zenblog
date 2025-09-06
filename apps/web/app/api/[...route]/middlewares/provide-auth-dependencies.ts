import { createAdminClient } from "@/lib/server/supabase/admin";
import { createClient } from "@/lib/server/supabase";
import { Context, Next } from "hono";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

export type AuthDependencies = {
  user: any; // Consider defining a more specific user type
  db: SupabaseClient<Database>;
};

export const provideAuthDependencies = async (
  c: Context<{ Variables: AuthDependencies }>,
  next: Next
) => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const adminSupabase = createAdminClient();

  c.set("user", user);
  c.set("db", adminSupabase);

  await next();
};
