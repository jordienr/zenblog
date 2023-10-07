import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import { getServerClient } from "@/lib/server/supabase";

export const config = {
  api: {
    bodyParser: false,
  },
};
const post = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("POST upload");
  const form = formidable({});
  const { db } = await getServerClient(req, res);
  const blogId = req.query.blogId as string;
  let fields;
  let files;

  try {
    [fields, files] = await form.parse(req);

    console.log(files);

    if (files.length) {
      return res.status(400).json({ error: "Must upload exactly one file" });
    }

    // const { data, error } = await db.storage
    //   .from("images")
    //   .upload(`${blogId}/test.png`, files);
    return res.status(200).json({ fields, files });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

export default post;
