import { contract } from "@/contract";
import { env } from "@/lib/env";
import { initClient } from "@ts-rest/core";

export function createClient({
  accessToken,
  _baseUrl,
}: {
  accessToken: string;
  _baseUrl?: string;
}) {
  const client = initClient(contract, {
    baseUrl: _baseUrl || env().BASE_API_URL,
    baseHeaders: {
      authorization: accessToken,
    },
  });

  return client;
}

// FOR TESTING PURPOSES
const client = createClient({
  accessToken: "Test",
});

client.posts.getBySlug({ params: { slug: "helloworld" } });
