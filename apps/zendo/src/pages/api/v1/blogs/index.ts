import { getServerClient } from "@/lib/server/supabase";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Blogs API", { method: req.method, body: req.body });
  const { db, user } = await getServerClient(req, res);

  if (!db || !user) {
    console.log("No user or db", { db, user });
    return res.status(401).json({ error: "Unauthorized 1" });
  }

  if (req.method === "POST") {
    const body = JSON.parse(req.body);

    const { data, error } = await db
      .from("blogs")
      .insert({
        title: body.title,
        description: body.description,
        emoji: body.emoji,
      })
      .select();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ ...data[0] });
  } else if (req.method === "GET") {
    const { data: blogs, error } = await db.from("blogs").select("*");

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(blogs);
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
