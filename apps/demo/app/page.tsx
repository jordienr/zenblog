export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-gray-900">Zenblog API Demo</h1>
      <p className="text-lg text-gray-600">
        This is a demo application showcasing the Zenblog API endpoints.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Posts</h2>
          <p className="text-gray-600 mb-4">
            Browse all blog posts with filtering options
          </p>
          <a
            href="/posts"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View Posts →
          </a>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Categories</h2>
          <p className="text-gray-600 mb-4">
            View all available categories
          </p>
          <a
            href="/categories"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View Categories →
          </a>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Tags</h2>
          <p className="text-gray-600 mb-4">
            Browse all tags used in blog posts
          </p>
          <a
            href="/tags"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View Tags →
          </a>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Authors</h2>
          <p className="text-gray-600 mb-4">
            View all blog authors and their posts
          </p>
          <a
            href="/authors"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View Authors →
          </a>
        </div>
      </div>
    </div>
  );
}
