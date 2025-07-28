import { CheckCircle2 } from "lucide-react";
import { CodeStepper, CodeStepperStep } from "./CodeStepper";

export const TsApiExample = () => {
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

  const STEPS: CodeStepperStep[] = [
    {
      id: "init",
      comment: "1. initialize the zenblog client",
      code: `import { createZenblogClient } from "zenblog";

const zenblog = createZenblogClient({ blogId: BLOG_ID });`,
      browser: (handleStepClick: (index: number) => void) => (
        <div>
          <div className="flex h-60 w-full flex-col items-center justify-center gap-4 text-center">
            <CheckCircle2 className="text-emerald-500" />
            <span className="font-mono text-sm">
              Zenblog client initialized successfully!
            </span>
            <button
              onClick={() => {
                handleStepClick(1);
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
      browser: () => (
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
      browser: () => (
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
  ] as const;

  return <CodeStepper steps={STEPS} />;
};
