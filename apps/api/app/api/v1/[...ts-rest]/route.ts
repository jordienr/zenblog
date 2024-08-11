import { contract } from "@/contract";
import { createNextHandler } from "@ts-rest/serverless/next";
import { TsRestResponseError } from "@ts-rest/core";
import { TsRestResponse } from "@ts-rest/serverless";
import { supabase } from "@/lib/db";
import { ratelimit } from "@/lib/ratelimit";
import { tsr } from "@ts-rest/serverless/fetch";

function getBlogIdFromToken(token: string) {
  return supabase.from("blogs").select("id").eq("access_token", token).single();
}

const handler = createNextHandler(
  contract,
  {
    posts: {
      get: async ({ headers, query }) => {
        const { data: blog, error } = await getBlogIdFromToken(
          headers.authorization
        );

        if (error) {
          throw new TsRestResponseError(contract, {
            status: 401,
            body: {
              message: "Unauthorized",
            },
          });
        }

        if (blog?.id) {
          const offset = query.offset || 0;
          const limit = query.limit || 30;

          const posts = await supabase
            .from("posts")
            .select("title, published_at, created_at, slug, cover_image")
            .eq("deleted", false)
            .eq("published", true)
            .eq("blog_id", blog.id)
            .order("published_at", { ascending: false })
            .range(offset, offset + limit - 1);

          if (posts.error) {
            throw new TsRestResponseError(contract, {
              status: 404,
              body: {
                message: "No posts found",
              },
            });
          }

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
          const { data: blog, error } = await getBlogIdFromToken(
            headers.authorization
          );

          if (error) {
            throw new TsRestResponseError(contract, {
              status: 401,
              body: {
                message: "Unauthorized",
              },
            });
          }

          if (blog?.id) {
            const post = await supabase
              .from("posts")
              .select(
                "title, published_at, created_at, slug, cover_image, html_content"
              )
              .eq("deleted", false)
              .eq("published", true)
              .eq("blog_id", blog.id)
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
            throw new TsRestResponseError(contract, {
              status: 401,
              body: {
                message: "Unauthorized",
              },
            });
          }

          return {
            status: 200,
            body: {
              slug: "slug",
              title: "Hello",
              html_content: "World",
              created_at: "2021-01-01",
              published_at: "2021-01-01",
              cover_image: "https://example.com/cover.jpg",
              abstract: "This is my first post!",
            },
          };
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
