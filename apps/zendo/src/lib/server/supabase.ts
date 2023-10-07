import { Database } from "@/types/supabase";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import type { NextApiRequest, NextApiResponse } from "next";

export async function getServerClient(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const supabaseServerClient = createPagesServerClient<Database>({
      req,
      res,
    });

    const userRes = await supabaseServerClient.auth.getUser();
    return {
      user: userRes?.data.user,
      db: supabaseServerClient,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}
