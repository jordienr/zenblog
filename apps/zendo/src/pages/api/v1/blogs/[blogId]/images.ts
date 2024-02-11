// Next API Function GET all blogs

import { NextApiRequest, NextApiResponse } from "next";
import { FileObject } from "@supabase/storage-js/src/lib/types";
import { getServerClient } from "@/lib/server/deprecated/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { db } = await getServerClient(req, res);
  const blogId = req.query.blogId as string;

  function getImageUrl(image: FileObject) {
    const { data } = db.storage
      .from("images")
      .getPublicUrl(`${blogId}/${image.name}`);

    return data.publicUrl;
  }

  // const postSlug = req.query.postSlug as string;

  if (req.method === "GET") {
    const { data, error } = await db.storage.from("images").list(blogId, {
      limit: 100,
      offset: 0,
      sortBy: { column: "name", order: "asc" },
    });

    const images = data?.map((image) => {
      return {
        id: image.id,
        name: image.name,
        url: getImageUrl(image),
        createdAt: image.created_at,
        updatedAt: image.updated_at,
      };
    });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(images);
  }
}
