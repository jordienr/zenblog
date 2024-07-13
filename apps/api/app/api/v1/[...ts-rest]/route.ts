import { contract } from "@/contract";
import { createNextHandler } from "@ts-rest/serverless/next";
import { TsRestResponseError } from "@ts-rest/core";

const handler = createNextHandler(
  contract,
  {
    getPostBySlug: async ({ params }) => {
      return {
        status: 200,
        body: {
          slug: "params.id",
          title: "Hello",
          html_content: "World",
        },
      };
    },
    getPosts: async () => {
      return {
        status: 200,
        body: [
          {
            slug: "1",
            title: "Hello",
            html_content: "World",
          },
        ],
      };
    },
  },
  {
    basePath: "/api/v1",
    jsonQuery: true,
    responseValidation: true,
    handlerType: "app-router",
  }
);

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
};
