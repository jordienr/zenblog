import { NextApiHandler } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

const handler: NextApiHandler = async (req, res) => {
  const { code } = req.query;

  console.log("AUTH CODE", code);
  if (code) {
    const supabase = createPagesServerClient({ req, res });
    console.log("AUTH SUPABASE", supabase);
    const resp = await supabase.auth.exchangeCodeForSession(String(code));
    console.log("AUTH RES", resp);
  }

  res.redirect("/");
};

export default handler;
