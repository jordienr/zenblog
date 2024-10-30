import { createLogger, throwError } from "./lib";
import { Category, Post, PostWithContent, Tag } from "@zenblog/types";
function toQueryString(obj: Record<string, any>) {
  const params = new URLSearchParams(obj);
  return params.toString();
}

function createFetcher(
  config: { url: string; blogId: string },
  log: (...args: any[]) => void
) {
  return async function _fetch(path: string, opts: RequestInit) {
    try {
      const URL = `${config.url}/blogs/${config.blogId}/${path}`;
      const reqOpts = {
        ...opts,
        headers: {
          "Content-Type": "application/json",
          ...opts.headers,
        },
      };

      log("fetch ", URL, reqOpts.method);
      const res = await fetch(URL, reqOpts);
      let json;
      try {
        json = await res.json();
      } catch (e) {
        throwError("Failed to parse JSON response from API", e);
      }

      if (!res.ok) {
        throwError("Error fetching data from API", res);
      }

      return json;
    } catch (error) {
      console.error("[Zenblog Error] ", error);
      throw error;
    }
  };
}

type CreateClientOpts = {
  blogId: string;
  _url?: string;
  _debug?: boolean;
};
export function createZenblogClient({
  blogId,
  _url,
  _debug,
}: CreateClientOpts) {
  if (typeof window !== "undefined") {
    throwError(
      "Zenblog is not supported in the browser. Make sure you don't leak your access token."
    );
  }

  const logger = createLogger(_debug || false);
  const fetcher = createFetcher(
    {
      url: _url || "https://zenblog.com/api/public",
      blogId,
    },
    logger
  );

  type ReqOpts = {
    cache?: RequestInit["cache"];
    limit?: number;
    offset?: number;
  };
  return {
    posts: {
      list: async function (
        { limit, offset, cache }: ReqOpts = {
          limit: 20,
          offset: 0,
          cache: "default",
        }
      ): Promise<{ data: Post[] }> {
        const data = await fetcher(
          `posts?${toQueryString({ limit, offset })}`,
          {
            method: "GET",
            cache,
          }
        );

        return data as { data: Post[] };
      },
      get: async function (
        { slug }: { slug: string },
        opts?: ReqOpts
      ): Promise<{ data: PostWithContent }> {
        const post = await fetcher(`posts/${slug}`, {
          method: "GET",
          cache: opts?.cache || "default",
        });

        return post as { data: PostWithContent };
      },
    },
    categories: {
      list: async function (): Promise<{ data: Category[] }> {
        const data = await fetcher(`categories`, {
          method: "GET",
        });

        return data as { data: Category[] };
      },
    },
    tags: {
      list: async function (): Promise<{ data: Tag[] }> {
        const data = await fetcher(`tags`, {
          method: "GET",
        });

        return data as { data: Tag[] };
      },
    },
  };
}
