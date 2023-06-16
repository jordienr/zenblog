import { getAPIKeysRes } from "@/lib/models/apiKeys/APIKeys";
import { getAuthAndDB } from "@/lib/server/handler";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 } from "uuid";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { db, auth } = await getAuthAndDB(req, res);
  if (!db) return res.status(401).json({ error: "Unauthorized" });

  if (!auth.userId) return res.status(401).json({ error: "Unauthorized" });

  const blogSlug = req.query.blogSlug;

  const blog = await db
    .from("blogs")
    .select("*")
    .eq("slug", blogSlug)
    .eq("user_id", auth.userId)
    .single();

  if (!blog || blog.error) {
    return res.status(500).json({ error: "Error trying to fetch blog" });
  }

  const method = req.method;

  if (method === "GET") {
    const dbRes = db
      .from("api_keys")
      .select("*")
      .eq("user_id", auth.userId)
      .eq("blog_id", blog.data.id);
    const { data: apiKeys, error } = await dbRes;

    if (error) {
      return res.status(500).json({ error: "Error trying to fetch API Keys" });
    }

    if (apiKeys.length === 0) {
      return res.status(200).json([]);
    }

    const resData = getAPIKeysRes.safeParse(apiKeys);

    if (!resData.success) {
      return res.status(500).json({ error: resData.error.message });
    }

    return res.status(200).json(resData.data);
  } else if (method === "POST") {
    const newKey = "zbp_" + v4();
    const body = JSON.parse(req.body);

    console.log("BODY.NAME", body.name);

    if (!body.name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const dbRes = await db
      .from("api_keys")
      .insert([
        {
          blog_id: blog.data.id,
          key: newKey,
          user_id: auth.userId,
          name: body.name,
        },
      ])
      .select()
      .single();

    if (!dbRes || dbRes.error) {
      return res.status(500).json({ error: "Error trying to create API Key" });
    }

    return res.status(200).json(dbRes.data);
  } else if (method === "DELETE") {
    // const apiKeyToDelete = req.body.key;
    // const dbRes = db
    //   .from("api_keys")
    //   .delete()
    //   .eq("user_id", userId)
    //   .eq("key", apiKeyToDelete);
    // const { data: apiKeys, error } = await dbRes;
    // return res.status(200).json(apiKeys);
  }
}
