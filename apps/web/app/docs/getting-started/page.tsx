import { CodeBlockComponent } from "@/components/code-block";

export default function GettingStarted() {
  return (
    <div className="prose prose-headings:font-medium mt-8">
      <h1>Getting started</h1>
      <p>
        Welcome to the Zenblog documentation. To get started, you need to create
        a blog in the Zenblog dashboard and grab your API key.
      </p>
      <h2>1. Install Zenblog</h2>
      <CodeBlockComponent filename="Terminal" language="sh">
        {`npm install zenblog`}
      </CodeBlockComponent>

      <h2>2. Initialize Zenblog</h2>
      <p>Initialize Zenblog with your API key.</p>
      <CodeBlockComponent
        filename="cms/index.tsx"
        language="typescript"
        highlightedLines={[]}
      >
        {`import { createZenblogClient } from "zenblog";

const zenblog = createZenblogClient({ blogId: process.env.ZENBLOG_BLOG_ID });`}
      </CodeBlockComponent>

      <h2>3. Fetch your posts</h2>
      <p>Fetch your posts from the Zenblog API.</p>
      <CodeBlockComponent
        filename="cms/index.tsx"
        language="typescript"
        highlightedLines={[5]}
      >
        {`import { createZenblogClient } from "zenblog";

const zenblog = createZenblogClient({ blogId: process.env.ZENBLOG_BLOG_ID });
        
const posts = await zenblog.posts.list();`}
      </CodeBlockComponent>

      <h2>4. Render your posts</h2>
      <p>Render your posts in your app.</p>
      <CodeBlockComponent
        filename="cms/index.tsx"
        language="jsx"
        highlightedLines={[4]}
      >
        {`
<div>
  {posts.map((post) => (
    <a href={\`/blog/\${post.slug}\`} key={post.id}>
      {post.title}
    </a>
  ))}
</div>
  `}
      </CodeBlockComponent>

      <h2>5. Fetch a single post with content</h2>
      <CodeBlockComponent
        filename="cms/index.tsx"
        language="tsx"
        highlightedLines={[5]}
      >
        {`import { createZenblogClient } from "zenblog";

const zenblog = createZenblogClient({ blogId: process.env.ZENBLOG_BLOG_ID });

const post = await zenblog.posts.get({ slug: "my-first-post" });`}
      </CodeBlockComponent>

      <h2>6. Render your post</h2>
      <p>Render your post in your app. NextJS example.</p>
      <CodeBlockComponent filename="cms/index.tsx" language="tsx">
        {`<div>{post.title}</div>
<div>{post.content}</div>
<div>{post.publishedAt}</div>
<div dangerouslySetInnerHTML={{ __html: post.html_content }} />`}
      </CodeBlockComponent>

      <p>
        You can use something like Tailwind Typography to easily style the HTML
        content.
      </p>
    </div>
  );
}
