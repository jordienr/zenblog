import React from "react";
import BaseCard from "./BaseCard";
import { CodeBlock } from "@/components/CodeBlock";

type Props = {};

const CodeExamples = (props: Props) => {
  return (
    <BaseCard
      title="Get a blog in 2 minutes"
      caption="Write your first post. Install the SDK. Have a brand new blog."
    >
      <div className="flex w-full flex-col gap-2 px-2 pb-2">
        <CodeBlock language="bash">{`npm i @zendo/cms`}</CodeBlock>
        <CodeBlock language="typescript">
          {`
  import { createClient } from "@zendo/cms";
  
  const cms = createClient({
    blogId: env.ZENDO_BLOG_ID,
  });
  
  const posts = await cms.posts.list();
  `}
        </CodeBlock>
      </div>
    </BaseCard>
  );
};

export default CodeExamples;
