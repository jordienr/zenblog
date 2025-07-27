import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { BrowserWrapper } from "./browser-wrapper";
import { CheckCircle2, Loader2 } from "lucide-react";
import { SyntaxHighlight } from "../syntax-highlight";
import { cn } from "@/lib/utils";

export const TsApiExample = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const posts = [
    {
      title: "Blogging Tips for 2025",
      published_at: "2025-07-31",
    },
    {
      title: "Grow your business with SEO",
      published_at: "2025-08-15",
    },
    {
      title: "The Future of Web Design",
      published_at: "2025-09-01",
    },
  ] as const;

  const STEPS = [
    {
      id: "init",
      comment: "1. initialize the zenblog client",
      code: `import { createZenblogClient } from "zenblog";

const zenblog = createZenblogClient({ blogId: BLOG_ID });`,
      browser: (
        <div>
          <div className="flex h-60 w-full flex-col items-center justify-center gap-4 text-center">
            <CheckCircle2 className="text-emerald-500" />
            <span className="font-mono text-sm">
              Zenblog client initialized successfully!
            </span>
            <button
              onClick={() => {
                setActiveStep(1);
              }}
              className="rounded-full bg-black px-3 py-1.5 font-medium text-white"
            >
              Next step
            </button>
          </div>
        </div>
      ),
    },
    {
      id: "getposts",
      comment: "2. fetch posts to build blog homepage",
      code: `const posts = await zenblog.posts.list();`,
      browser: (
        <div>
          <h1 className="py-8 text-center text-xl font-medium">
            My Startup Blog
          </h1>
          <div className="grid grid-cols-2 gap-4">
            {posts.map((post) => (
              <div key={post.title}>
                <div className="h-24 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600"></div>
                <h3 className="my-4 text-xl font-medium">{post.title}</h3>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "getpost",
      comment: "3. fetch a single post with its content",
      code: `const post = await zenblog.posts.get({ slug: params.slug });`,
      browser: (
        <div>
          <div className="mb-4 h-24 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600"></div>
          <h1 className="text-2xl font-medium">{posts[0].title}</h1>
          <p>Published on: {posts[0].published_at}</p>
          <hr />
          <p className="mt-4 font-mono">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
            ullamcorper, nisl at venenatis facilisis, erat felis aliquet enim,
            nec luctus ligula leo et quam.
          </p>
        </div>
      ),
    },
  ];

  const handleStepClick = (index: number) => {
    if (index === activeStep) return;

    setActiveStep(index);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="flex min-h-[600px] gap-px rounded-3xl bg-slate-800 p-2">
      <div className="w-full space-y-px pr-4 font-mono text-sm">
        {STEPS.map((step, index) => (
          <div
            key={step.id}
            className={cn(
              `cursor-pointer rounded-2xl p-4 opacity-50 transition-opacity duration-300 hover:bg-slate-700/50`,
              { "bg-slate-700/50 opacity-100": index === activeStep }
            )}
            onClick={() => handleStepClick(index)}
          >
            <div className="mb-3 text-slate-400">{`// ` + step.comment}</div>
            <pre className="whitespace-pre-wrap text-white">
              <SyntaxHighlight
                code={step.code}
                language="tsx"
              ></SyntaxHighlight>
            </pre>
          </div>
        ))}
      </div>
      <div className="w-[500px]">
        <BrowserWrapper>
          <motion.div
            key={isLoading ? "loading" : activeStep}
            className="p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {isLoading ? (
              <div className="flex h-60 w-full items-center justify-center">
                <Loader2 className="animate-spin" />
              </div>
            ) : (
              STEPS[activeStep]?.browser
            )}
          </motion.div>
        </BrowserWrapper>
      </div>
    </div>
  );
};
