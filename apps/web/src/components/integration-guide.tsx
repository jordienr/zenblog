import { Info } from "lucide-react";
import { CodeBlock } from "./CodeBlock";

export function IntegrationGuide({ blogId }: { blogId: string }) {
  return (
    <>
      <section className="px-3 [&_h3]:mb-3 [&_h3]:mt-8">
        <h2 className="text-lg font-medium">Integration guide</h2>
        <h3>First, install the zenblog client</h3>
        <CodeBlock language="bash">{`npm install zenblog`}</CodeBlock>

        <h3>Next, store your blog id as an environment variable</h3>

        <CodeBlock language="properties" title=".env">
          {`BLOG_ID=${blogId}`}
        </CodeBlock>

        <p className="mt-2 flex items-center gap-2 rounded-md border border-yellow-300 bg-yellow-100 px-3 py-2 text-yellow-700">
          <Info size={16} className="" />
          Avoid making your blog id public. You should store it in a secure way.
        </p>

        <h3>Now, create a client with your blog id</h3>

        <CodeBlock title="/lib/cms.ts">
          {`import { createZenblogClient } from "zenblog";

const cms = createZenblogClient({
  blogId: process.env.ZENBLOG_BLOG_ID,
});`}
        </CodeBlock>

        <h3>Use the client to fetch posts and render them on your website.</h3>
        <CodeBlock title="/app/blog/page.tsx">
          {`import { cms } from "../lib/cms";
import Link from "next/link";

const posts = await cms.posts.list();

return <div>
  {posts.map((post) => 
    <Link 
      href={"/blog/" + post.slug} 
      key={post.slug}
      >
        {post.title}
      </Link>
    )}
</div>`}
        </CodeBlock>

        <h3>That&apos;s it! 👏 Your blog page is ready.</h3>
        <p>Next, you should learn how to render the posts content.</p>
      </section>
    </>
  );
}
