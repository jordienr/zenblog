import { contract } from "@/contract";
import { generateOpenApi } from "@ts-rest/open-api";

const openApiDocument = generateOpenApi(contract, {
  info: {
    title: "Zenblog API Docs",
    description:
      "Use this API to fetch your content and build an amazing blog with your favorite stack!",
    contact: {
      email: "team@zenblog.com",
      name: "Zenblog Team",
      url: "https://zenblog.com",
    },
    version: "1.0.0",
  },
});

export function GET() {
  return new Response(JSON.stringify(openApiDocument), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
