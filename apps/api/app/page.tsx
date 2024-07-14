import Link from "next/link";

export default function Page() {
  return (
    <div className="p-3">
      <h2 className="text-lg">Getting started</h2>
      <p>
        Welcome to the Zenblog API! You can use this API to fetch posts from
        your blog.
      </p>
      <h3>Authentication</h3>
      <p>
        To use the Zenblog API, you need to include an{" "}
        <code>Authorization</code> header with your Access token, which you can
        find in the Zenblog dashboard in your blog settings page.
      </p>
    </div>
  );
}
