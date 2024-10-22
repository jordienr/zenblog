"use client";

import { ObjectRenderer } from "app/docs/ui/object-renderer";
import { useParams } from "next/navigation";
import {
  BASE_API_URL,
  endpoints,
} from "app/api/public/[...route]/public-api.constants";

export default function Endpoint() {
  const params = useParams<{ endpointId: string }>();
  const endpointId = params?.endpointId;

  const endpoint = endpoints.find((e) => e.id === endpointId);

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
        <h2 id={endpoint.id} className="text-xl font-medium">
          {endpoint.title}
        </h2>
        <p>{endpoint.description}</p>

        <div className="mt-4">
          <ObjectRenderer
            object={{
              url: `${BASE_API_URL}${endpoint.path}`,
              method: endpoint.method,
            }}
          />
        </div>
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
            {Object.entries(endpoint.response).map(([status, response]) => (
              <div key={status}>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{status}</p>
                  <p>{response.description}</p>
                </div>
                <pre className="mt-2 overflow-x-auto rounded-md bg-gray-100 p-4 text-xs">
                  {response.example}
                </pre>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
