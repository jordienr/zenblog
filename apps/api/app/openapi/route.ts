import { contract } from "@/contract";
import { generateOpenApi } from "@ts-rest/open-api";

const openApiDocument = generateOpenApi(contract, {
  info: {
    title: "Zenblog API",
    version: "1.0.0",
  },
});

console.log(openApiDocument);

export function GET() {
  return new Response(JSON.stringify(openApiDocument), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
