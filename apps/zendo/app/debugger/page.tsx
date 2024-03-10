import React from "react";
import { createClient } from "zenblog";

type Props = {};

const index = async (props: Props) => {
  const cms = createClient({
    blogId: "673a21e5-145f-4c7f-815d-5627ac681f8e",
    _url: `${process.env.NEXT_PUBLIC_API_URL}/public`,
  });

  const posts = await cms.posts.getAll();

  return (
    <div>
      <pre>{JSON.stringify(posts, null, 2)}</pre>
    </div>
  );
};

export default index;
