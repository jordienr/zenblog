import { Context } from "hono";
import { StatusCode } from "hono/utils/http-status";
import { axiom, AXIOM_DATASETS } from "lib/axiom";

const ERROR_TABLE = "zenblog-errors";

type ErrorItem = {
  message: string;
  status: StatusCode;
};
const ERROR_MAP: Record<string, ErrorItem> = {
  MISSING_BLOG_ID: { message: "No blogId provided", status: 400 },
  MISSING_API_KEY: { message: "No API key provided", status: 400 },
  NO_POSTS_FOUND: { message: "No posts found", status: 404 },
  INVALID_API_KEY: { message: "Invalid API key", status: 401 },
  NO_CATEGORIES_FOUND: { message: "No categories found", status: 404 },
  NO_TAGS_FOUND: { message: "No tags found", status: 404 },
  AUTHOR_NOT_FOUND: { message: "Author not found", status: 404 },
};

export const throwError = (ctx: Context, error: keyof typeof ERROR_MAP) => {
  console.log(`🔴 ${ERROR_MAP[error]?.message}`);
  axiom.ingest(AXIOM_DATASETS.api, {
    error: ERROR_MAP[error]?.message,
    request: ctx.req,
    status: ERROR_MAP[error]?.status,
  });
  return ctx.json(
    { message: ERROR_MAP[error]?.message },
    ERROR_MAP[error]?.status
  );
};
