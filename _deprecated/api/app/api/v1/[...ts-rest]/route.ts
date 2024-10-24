import { contract } from "@/contract";
import { createNextHandler } from "@ts-rest/serverless/next";
import { TsRestResponseError } from "@ts-rest/core";
import { TsRestResponse } from "@ts-rest/serverless";
import { supabase } from "@/lib/db";
import { ratelimit } from "@/lib/ratelimit";
import bcrypt from "bcrypt";

async function verifyAPIKey(header: string, blogId: string) {
  const unhashedKey = header.split(" ")[1];

  const { data, error } = await supabase
    .from("blogs")
    .select("access_token")
    .eq("id", blogId)
    .single();

  if (error) {
    console.log("🔴 Error getting blog id from token:", error);
    return false;
  }

  const isValid = await bcrypt.compare(unhashedKey, data?.access_token);

  console.log("🔴 Is valid:", isValid);
  return isValid;
}

const handler = createNextHandler(
  contract,
  {
    posts: {
      get: async ({ headers, query, params }) => {
        const isValid = await verifyAPIKey(
          headers.authorization,
          params.blogId
        );

        if (!isValid) {
          throw new TsRestResponseError(contract, {
            status: 401,
            body: {
              message: "Unauthorized",
            },
          });
        }

        if (params.blogId) {
          const offset = query.offset || 0;
          const limit = query.limit || 30;

          const posts = await supabase
            .from("posts_v5")
            .select(
              "title, published_at, created_at, slug, cover_image, category_name, category_slug"
            )
            .eq("deleted", false)
            .eq("published", true)
            .eq("blog_id", params.blogId)
            .order("published_at", { ascending: false })
            .range(offset, offset + limit - 1);

          if (posts.error) {
            console.log("🔴 Error getting posts:", posts.error);
            throw new TsRestResponseError(contract, {
              status: 404,
              body: {
                message: "No posts found",
              },
            });
          }
          console.log("🟢 Posts:", posts.data[0].category_name);

          return {
            status: 200,
            body: posts.data,
          };
        } else {
          throw new TsRestResponseError(contract, {
            status: 401,
            body: {
              message: "Unauthorized",
            },
          });
        }
      },
      getBySlug: {
        handler: async ({ params, headers }) => {
          const isValid = await verifyAPIKey(
            headers.authorization,
            params.blogId
          );

          if (!isValid) {
            throw new TsRestResponseError(contract, {
              status: 401,
              body: {
                message: "Unauthorized",
              },
            });
          }

          if (params.blogId) {
            console.log("🔴 Missing blogId");
            throw new TsRestResponseError(contract, {
              status: 401,
              body: {
                message: "Unauthorized",
              },
            });
          }

          if (params.slug) {
            const post = await supabase
              .from("posts")
              .select(
                "title, published_at, created_at, slug, cover_image, html_content, category_name, category_slug"
              )
              .eq("deleted", false)
              .eq("published", true)
              .eq("blog_id", params.blogId)
              .eq("slug", params.slug)
              .single();

            if (post.error) {
              throw new TsRestResponseError(contract, {
                status: 404,
                body: {
                  message: "Post not found",
                },
              });
            }

            return {
              status: 200,
              body: post.data,
            };
          } else {
            console.log("🔴 Missing slug");
            throw new TsRestResponseError(contract, {
              status: 401,
              body: {
                message: "Unauthorized",
              },
            });
          }
        },
      },
    },
  },
  {
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
      async (req, res) => {
        const authorization = req.headers.get("Authorization");
        const blogId = req.params.blogId;

        console.log("🔴 Blog ID:", blogId);

        if (!blogId) {
          console.log("🔴 Middleware: Missing blogId.");
          throw new TsRestResponseError(contract, {
            status: 401,
            body: {
              message: "Unauthorized. Missing blogId.",
            },
          });
        }

        if (!authorization) {
          console.log("🔴 Middleware: Missing Authorization header.");
          throw new TsRestResponseError(contract, {
            status: 401,
            body: {
              message: "Unauthorized. Missing Authorization header.",
            },
          });
        }

        const { success } = await ratelimit.limit(authorization);

        if (!success) {
          throw new TsRestResponseError(contract, {
            status: 429,
            body: {
              message: "Too Many Requests",
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
