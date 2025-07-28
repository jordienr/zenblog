import { CodeStepper } from "./CodeStepper";

export const HttpApiExample = () => {
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
      id: "fetch-posts",
      comment: "fetch posts to build blog homepage",
      code: `const response = await fetch('https://api.zenblog.com/blogs/YOUR_BLOG_ID/posts');
const { data: posts } = await response.json();`,
      browser: () => (
        <div>
          <h1 className="py-8 text-center text-xl font-medium">
            My Startup Blog
          </h1>
          <div className="grid gap-4">
            {posts.map((post) => (
              <div key={post.title} className="flex gap-4">
                <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600"></div>
                <div>
                  <h3 className="text-lg font-medium">{post.title}</h3>
                  <p className="text-sm text-gray-600">{post.published_at}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "fetch-post",
      comment: "fetch a single post with its content",
      code: `const response = await fetch('https://api.zenblog.com/blogs/YOUR_BLOG_ID/posts/post-slug');
const post = await response.json();`,
      browser: () => (
        <div>
          <div className="mb-4 h-24 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600"></div>
          <h1 className="text-2xl font-medium">{posts[0].title}</h1>
          <p>Published on: {posts[0].published_at}</p>
          <hr />
          <p className="mt-4 font-mono">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
            ullamcorper, nisl at venenatis facilibus, erat felis aliquet enim,
            nec luctus ligula leo et quam.
          </p>
        </div>
      ),
    },
    {
      id: "fetch-filtered",
      comment: "fetch posts filtered by category or tags",
      code: `const response = await fetch('https://api.zenblog.com/blogs/YOUR_BLOG_ID/posts?category=news&limit=10');
const { data: posts } = await response.json();`,
      browser: () => (
        <div>
          <h1 className="py-8 text-center text-xl font-medium">
            News Category
          </h1>
          <div className="space-y-4">
            {posts.slice(0, 2).map((post) => (
              <div key={post.title} className="flex gap-4">
                <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600"></div>
                <div>
                  <h3 className="text-lg font-medium">{post.title}</h3>
                  <p className="text-sm text-gray-600">{post.published_at}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  return <CodeStepper steps={STEPS} />;
};
