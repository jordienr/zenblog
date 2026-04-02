import { ObjectRenderer } from "app/(docs)/ui/object-renderer";
import {
  BASE_API_URL,
  endpoints,
} from "app/api/public/[...route]/public-api.constants";
import { Metadata } from "next";
import { CodeExamples } from "./code-examples";
import { CodeBlock } from "@/components/CodeBlock";

type Props = {
  params: Promise<{ endpointId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const endpointId = (await params).endpointId;
  const endpoint = endpoints.find((e) => e.id === endpointId);
  return {
    title: endpoint?.title,
    description: endpoint?.description,
    keywords: ["api", "documentation", "zenblog", "cms", "headless cms"],
    abstract: endpoint?.description,
    authors: [{ name: "Zenblog", url: "https://zenblog.com" }],
  };
}

export default async function Endpoint(props: Props) {
  const params = await props.params;
  const endpointId = params?.endpointId;

  const endpoint = endpoints.find((e) => e.id === endpointId);

  const hasQuery = endpoint?.query?.length;
  const hasHeaders = endpoint?.headers?.length;

  if (!endpoint) {
    return <div>Endpoint not found</div>;
  }

  return (
    <>
      <div
        id={endpoint.id}
        key={endpoint.path}
        className="m-2 rounded-md p-4 [&_h3]:font-sans"
      >
        <h1 id={endpoint.id} className="text-xl font-medium">
          {endpoint.title}
        </h1>
        <p>{endpoint.description}</p>

        <div className="mt-4">
          <ObjectRenderer
            object={{
              url: `${BASE_API_URL}${endpoint.path}`,
              method: endpoint.method,
            }}
          />
        </div>
        {hasHeaders && (
          <div className="mt-4">
            <h3 className="text-md font-medium">Headers</h3>
            <ul className="mt-2 list-disc space-y-2 pl-4">
              {endpoint.headers?.map((header) => (
                <li key={header.key}>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{header.key}</p>
                    <p className="text-xs text-zinc-400">
                      {header.required ? "Required" : "Optional"}
                    </p>
                  </div>
                  <p>{header.description}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
        {hasQuery && (
          <div className="mt-4">
            <h3 className="text-md font-medium">Query</h3>
            <ul className="mt-2 list-disc space-y-2 pl-4">
              {endpoint.query?.map((query) => (
                <li key={query.key}>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{query.key}</p>
                    <p className="text-xs text-zinc-400">
                      {query.required ? "Required" : "Optional"}
                    </p>
                  </div>
                  <p>{query.description}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
        <hr className="-mx-4 my-3" />
        <div className="">
          <h3 className="text-md font-medium">Response</h3>
          <div className="mt-2">
            {Object.entries(endpoint.response).map(([status, response]) => (
              <div key={status}>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{status}</p>
                  <p>{response.description}</p>
                </div>
                <CodeBlock language="typescript">{response.example}</CodeBlock>
              </div>
            ))}
          </div>
        </div>

        <hr className="my-4" />
        <section>
          <h3 className="text-md font-medium">Usage</h3>
          <CodeExamples examples={endpoint.examples} />
        </section>
      </div>
    </>
  );
}
