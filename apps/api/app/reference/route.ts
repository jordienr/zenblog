import { env } from "@/lib/env";
import { ApiReference } from "@scalar/nextjs-api-reference";

export const GET = ApiReference({
  metaData: {
    title: "Zenblog API Docs",
    description: "API docs for Zenblog",
  },
  baseServerURL: env().BASE_API_URL,
  spec: {
    url: "/openapi",
  },
});
