import { getAuthAndDB } from "@/lib/server/handler";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;

  const { db, auth } = await getAuthAndDB(req, res);

  if (!db || !auth.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (method === "DELETE") {
    const key = req.body.key;
  }
}
