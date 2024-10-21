import { endpoints } from "app/api/public/[...route]/route";
import Link from "next/link";

export default function Docs() {
  return (
    <div className="h-screen">
      <div className="flex">
        <aside className="min-w-[240px] flex-col gap-2 border-r p-4">
          <h2 className="text-lg font-medium tracking-tight">
            <Link href="/">Zenblog</Link>
          </h2>

          {endpoints.map((endpoint) => (
            <a
              key={endpoint.id}
              href={`#${endpoint.id}`}
              className="font-mono hover:underline"
            >
              {endpoint.title}
            </a>
          ))}
        </aside>

        <main className="max-h-screen flex-1 space-y-4 overflow-y-auto bg-zinc-100 pb-32">
          {endpoints.map((endpoint) => (
            <div
              id={endpoint.id}
              key={endpoint.path}
              className="m-4 rounded-md border bg-white p-4 font-mono shadow-sm [&_h3]:font-sans"
            >
              <h2 id={endpoint.id} className="text-lg font-medium">
                {endpoint.title}
              </h2>
              <p>{endpoint.description}</p>
              <hr className="-mx-4 my-3" />
              <div className="flex items-center gap-4">
                <p className="text-sm text-gray-500">{endpoint.method}</p>
                <p className="rounded-md bg-zinc-100 px-3 py-1">
                  {endpoint.path}
                </p>
              </div>
              <hr className="-mx-4 my-3" />
              <div className="mt-4">
                <h3 className="text-md font-medium">Headers</h3>
                <ul className="mt-2 list-disc space-y-2 pl-4">
                  {endpoint.headers.map((header) => (
                    <li key={header.key}>
                      <div className="flex gap-2">
                        <p className="font-medium">{header.key}</p>
                        <p>{header.required ? "Required" : "Optional"}</p>
                      </div>
                      <p>{header.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <hr className="-mx-4 my-3" />
              <div className="">
                <h3 className="text-md font-medium">Response</h3>
                <div className="mt-2">
                  {Object.entries(endpoint.response).map(
                    ([status, response]) => (
                      <div key={status}>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{status}</p>
                          <p>{response.description}</p>
                        </div>
                        <pre className="mt-2 overflow-x-auto rounded-md bg-gray-100 p-4 text-xs">
                          {response.example}
                        </pre>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}
