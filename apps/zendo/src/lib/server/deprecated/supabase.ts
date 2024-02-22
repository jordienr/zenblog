import { Database } from "@/types/supabase";
import {
  createServerClient,
  type CookieOptions,
  serialize,
} from "@supabase/ssr";
import type { NextApiRequest, NextApiResponse } from "next";

export async function getServerClient(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return req.cookies[name];
          },
          set(name: string, value: string, options: CookieOptions) {
            res.appendHeader("Set-Cookie", serialize(name, value, options));
          },
          remove(name: string, options: CookieOptions) {
            res.appendHeader("Set-Cookie", serialize(name, "", options));
          },
        },
      }
    );

    const userRes = await supabase.auth.getUser();
    return {
      user: userRes?.data.user,
      db: supabase,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}
