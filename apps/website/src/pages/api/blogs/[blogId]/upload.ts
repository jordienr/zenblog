import { getAdminDB, getAuthAndDB } from "@/lib/server/handler";
import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};
// FIX FormidableError: no parser found
const post = async (req: NextApiRequest, res: NextApiResponse) => {
  const form = formidable({});
  const db = getAdminDB();
  const blogId = req.query.blogId as string;
  let fields;
  let files;

  try {
    [fields, files] = await form.parse(req);

    if (files.length) {
      return res.status(400).json({ error: "Must upload exactly one file" });
    }

    const { data, error } = await db.storage
      .from("images")
      .upload(`${blogId}/test.png`, files.file);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

export default post;
