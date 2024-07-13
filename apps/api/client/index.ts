import { contract } from "@/contract";
import { initClient } from "@ts-rest/core";

export function createClient({
  accessToken,
  _baseUrl,
}: {
  accessToken: string;
  _baseUrl?: string;
}) {
  const client = initClient(contract, {
    baseUrl: _baseUrl || "http://localhost:3000",
    baseHeaders: {
      authorization: accessToken,
    },
  });

  return client;
}
