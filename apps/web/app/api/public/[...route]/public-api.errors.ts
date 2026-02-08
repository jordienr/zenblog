import { Context, TypedResponse } from "hono";
import { StatusCode } from "hono/utils/http-status";
import { axiom, AXIOM_DATASETS } from "lib/axiom";

type ErrorItem = {
  message: string;
  status: StatusCode;
};

const ERROR_MAP = {
  MISSING_BLOG_ID: { message: "No blogId provided", status: 400 },
  MISSING_API_KEY: { message: "No API key provided", status: 400 },
  MISSING_BLOG_ID_OR_SLUG: { message: "Missing blogId or slug", status: 400 },
  NO_POSTS_FOUND: { message: "No posts found", status: 404 },
  NO_AUTHORS_FOUND: { message: "No authors found", status: 404 },
  INVALID_API_KEY: { message: "Invalid API key", status: 401 },
  NO_CATEGORIES_FOUND: { message: "No categories found", status: 404 },
  NO_TAGS_FOUND: { message: "No tags found", status: 404 },
  AUTHOR_NOT_FOUND: { message: "Author not found", status: 404 },
} as const satisfies Record<string, ErrorItem>;

type PublicApiErrorCode = keyof typeof ERROR_MAP;
type BadRequestErrorCode =
  | "MISSING_BLOG_ID"
  | "MISSING_API_KEY"
  | "MISSING_BLOG_ID_OR_SLUG";
type NotFoundErrorCode =
  | "NO_POSTS_FOUND"
  | "NO_AUTHORS_FOUND"
  | "NO_CATEGORIES_FOUND"
  | "NO_TAGS_FOUND"
  | "AUTHOR_NOT_FOUND";
type UnauthorizedErrorCode = "INVALID_API_KEY";

export function throwError(
  ctx: Context,
  error: BadRequestErrorCode
): TypedResponse<{ message: string }, 400>;
export function throwError(
  ctx: Context,
  error: NotFoundErrorCode
): TypedResponse<{ message: string }, 404>;
export function throwError(
  ctx: Context,
  error: UnauthorizedErrorCode
): TypedResponse<{ message: string }, 401>;
export function throwError(
  ctx: Context,
  error: PublicApiErrorCode
): TypedResponse<{ message: string }, 400 | 401 | 404> {
  const errorItem = ERROR_MAP[error];
  console.log(`🔴 ${errorItem.message}`);
  axiom.ingest(AXIOM_DATASETS.api, {
    error: errorItem.message,
    request: ctx.req,
    status: errorItem.status,
  });
  return ctx.json(
    { message: errorItem.message },
    errorItem.status
  );
}
