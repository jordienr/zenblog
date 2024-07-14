import { contract } from "@/contract";
import { createNextHandler } from "@ts-rest/serverless/next";
import { TsRestResponseError } from "@ts-rest/core";
import { TsRestRequest, TsRestResponse } from "@ts-rest/serverless";

const handler = createNextHandler(
  contract,
  {
    posts: {
      get: async () => {
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
      getBySlug: {
        handler: async ({ params }) => {
          return {
            status: 200,
            body: {
              slug: "slug",
              title: "Hello",
              html_content: "World",
            },
          };
        },
      },
    },
  },
  {
    // basePath: API_PATH,
    jsonQuery: true,
    responseValidation: true,
    handlerType: "app-router",
    errorHandler: async (error: any) => {
      return new TsRestResponse(
        JSON.stringify({
          message: error.message,
          status: error.statusCode,
          body: error.body,
        }),
        {
          status: error.statusCode || 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    },
    requestMiddleware: [
      (req) => {
        const authorization = req.headers.get("Authorization");
        if (!authorization) {
          throw new TsRestResponseError(contract, {
            status: 401,
            body: {
              message: "Unauthorized",
            },
          });
        }
      },
    ],
  }
);

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
};
