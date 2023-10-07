// import { getAuth } from "@clerk/nextjs/server";
import { getServerClient } from "@/lib/server/supabase";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { db } = await getServerClient(req, res);
  if (!db) return res.status(401).json({ error: "Unauthorized" });

  // const { userId } = getAuth(req);
  const blogId = req.query.blogId as string;
  const invitationId = req.query.invitationId as string;

  const method = req.method;

  if (method === "DELETE") {
    const { data: invitation, error } = await db
      .from("invitations")
      .delete()
      .eq("id", invitationId)
      .eq("blog_id", blogId)
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({
      success: true,
    });
  }
}
