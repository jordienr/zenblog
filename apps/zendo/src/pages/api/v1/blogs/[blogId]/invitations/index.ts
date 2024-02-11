import { getServerClient } from "@/lib/server/deprecated/supabase";
import { randomUUID } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";

const resendKey = process.env.RESEND;
const resend = new Resend(resendKey);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { db } = await getServerClient(req, res);
  if (!db) return res.status(401).json({ error: "Unauthorized" });

  const blogId = req.query.blogId as string;

  const method = req.method;

  if (method === "GET") {
    const { data: invitations, error } = await db
      .from("invitations")
      .select("*")
      .eq("blog_id", blogId);

    if (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(invitations);
  } else if (method === "POST") {
    const { name, email } = JSON.parse(req.body);

    if (!name || !email) {
      return res.status(400).json({ error: "Missing name or email" });
    }

    const { data: invitation, error } = await db
      .from("invitations")
      .insert({ blog_id: blogId, name, email })
      .single();

    const resendRes = await resend.emails.send({
      from: "zenblog <yo@comms.zenblog.com>",
      to: [email],
      subject: "new zenblog invitation",
      text: `hey ${name}, you have been invited to join zenblog, please go to https://zenblog.com/ and sign in or create an account to accept it.`,
      headers: {
        "X-Entity-Ref-ID": randomUUID(),
      },
      tags: [
        {
          name: "category",
          value: "confirm_email",
        },
      ],
    });

    console.log(resendRes);

    if (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true });
  }
}
