// app/reference/route.ts
import { ApiReference } from "@scalar/nextjs-api-reference";

const config = {
  spec: {
    url: "/openapi",
  },
};

export const GET = ApiReference(config);
