import { ApiReference } from "@scalar/nextjs-api-reference";

export const GET = ApiReference({
  metaData: {
    title: "Zenblog API Docs",
    description: "API docs for Zenblog",
  },
  spec: {
    url: "/openapi",
  },
});
