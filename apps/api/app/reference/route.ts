import { BASE_URL } from "@/lib/constants";
import { ApiReference } from "@scalar/nextjs-api-reference";

export const GET = ApiReference({
  metaData: {
    title: "Zenblog API Docs",
    description: "API docs for Zenblog",
  },
  baseServerURL: BASE_URL,
  spec: {
    url: "/openapi",
  },
});
