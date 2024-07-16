import Link from "next/link";

export default function Page() {
  return (
    <>
      <nav className="mx-auto flex w-full max-w-2xl justify-between gap-1 border-b px-3 py-1 text-sm *:p-2 *:font-medium">
        <h2>Zenblog API</h2>
        <div className="flex gap-4 font-mono tracking-tight *:font-normal *:text-slate-700">
          <Link href="/reference">API Reference</Link>
        </div>
      </nav>
      <div className="prose prose-headings:font-medium prose-headings:tracking-tight prose-h1:text-2xl prose-headings:font-serif mx-auto mt-8 max-w-2xl p-3">
        <h1 className="">Getting started</h1>
        <p>
          Welcome to the Zenblog API! You can use this API to fetch posts from
          your blog.
        </p>
        <h3>Authentication</h3>
        <p>
          To use the Zenblog API, you need to include an{" "}
          <code>Authorization</code> header with your Access token.
        </p>
        <p>
          You can find the token in the Zenblog dashboard{" "}
          <b>in your blog settings page</b>.
        </p>

        <pre className="text-xs">
          <code>
            {`curl -H "Authorization: Bearer <your-access-token>" https://api.zenblog.com/posts`}
          </code>
        </pre>

        <h3>Endpoints</h3>

        <p>
          The Zenblog API has the following endpoints:
          <ul>
            <li>
              <code>GET /posts</code> - Get all posts from your blog.
            </li>
            <li>
              <code>GET /posts/:slug</code> - Get a specific post by{" "}
              <code>slug</code>.
            </li>
          </ul>
        </p>

        <h3>API Reference</h3>
        <p>
          For more details on the API endpoints, check out the{" "}
          <Link href="/reference">API Reference</Link>.
        </p>
      </div>
    </>
  );
}
