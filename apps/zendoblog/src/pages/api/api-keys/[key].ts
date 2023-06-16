import { getAuthAndDB } from "@/lib/server/handler";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;
  const key = req.query.key as string;

  const { db, auth } = await getAuthAndDB(req, res);

  if (!db || !auth.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (method === "DELETE") {
    console.log("DELETE, ", key);
    const dbRes = await db
      .from("api_keys")
      .delete()
      .eq("key", key)
      .eq("user_id", auth.userId);

    if (dbRes.error) {
      return res.status(500).json({ error: dbRes.error.message });
    }

    return res.status(200).json({ success: true });
  }
}
