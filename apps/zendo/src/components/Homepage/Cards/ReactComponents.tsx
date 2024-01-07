import { CodeBlock } from "@/components/CodeBlock";
import React from "react";
import { motion } from "framer-motion";
import BaseCard from "./BaseCard";
type Props = {};

const ReactComponents = (props: Props) => {
  const demoBlogPosts = [
    "How to start a cult",
    "Cultivating a following",
    "Designing your cult logo",
    "The perfect cult slogan",
    "Cults don't have to be bad",
    "Make money with your cult",
  ];

  return (
    <BaseCard
      title="React Components"
      caption="Use our React components to build your website faster"
    >
      <div className="mx-4 flex w-full flex-col gap-6 p-2 md:flex-row">
        <CodeBlock title="pages/blog.tsx" language="tsx">
          {`
  import { PostList } from "@zendo/cms";
  import { createClient } from "@zendo/cms";

  const Blog = () => {

    const client = createClient({
      blogId: env.ZENDO_BLOG_ID,
    })

    return (
      <div>
        <PostList client={client} />
      </div>
    );
  };
                `}
        </CodeBlock>
        <div className="w-full flex-wrap rounded-md border bg-slate-50 shadow-md md:flex-nowrap">
          <div className="flex items-center justify-between border-b p-2">
            <div className="flex w-14 gap-2">
              <span className="h-3 w-3 rounded-full bg-slate-300"></span>
              <span className="h-3 w-3 rounded-full bg-slate-300"></span>
              <span className="h-3 w-3 rounded-full bg-slate-300"></span>
            </div>
            <div className="rounded-md bg-slate-200 px-12 py-0.5 text-sm font-medium">
              cultingaround.com
            </div>
            <div className="w-14"></div>
          </div>
          <div className="px-2">
            <div className="flex justify-between gap-4 p-3">
              <h1 className="font-medium">🦹‍♂️ Culting Around</h1>
              <h1 className="underline">Blog</h1>
            </div>
            <ul className="mt-2 w-full px-4">
              {demoBlogPosts.map((post) => (
                <motion.li
                  key={post}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.2,
                    delay: 0.4,
                  }}
                  className="flex items-center gap-2 text-lg font-medium"
                >
                  <a href="#" className="p-2 underline">
                    {post}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </BaseCard>
  );
};

export default ReactComponents;
