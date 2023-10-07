// import { getAuth } from "@clerk/nextjs/server";
import { getServerClient } from "@/lib/server/supabase";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { db } = await getServerClient(req, res);
  if (!db) return res.status(401).json({ error: "Unauthorized" });
  const CLERK_BASE_URL = "https://api.clerk.dev/v1/invitations";

  // const { userId } = getAuth(req);
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

    const clerk = await fetch(CLERK_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
      body: JSON.stringify({
        email_address: email,
      }),
    });

    const { data: invitation, error } = await db
      .from("invitations")
      .insert({ blog_id: blogId, name, email })
      .single();

    if (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true });
  }
}
