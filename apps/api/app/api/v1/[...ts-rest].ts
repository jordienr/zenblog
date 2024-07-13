import { contract } from "@/contract";
import { createNextHandler } from "@ts-rest/serverless/next";

const handler = createNextHandler(
  contract,
  {
    getPost: async ({ params }) => {
      return {
        status: 200,
        body: {
          id: "params.id",
          title: "Hello",
          body: "World",
        },
      };
    },
    createPost: async ({ body }) => {
      return {
        status: 201,
        body: {
          id: "1",
          title: body.title,
          body: body.body,
        },
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
