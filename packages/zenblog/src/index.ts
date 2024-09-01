import { createLogger, throwError } from "./lib";
import { Post, PostWithContent, CreateClientOpts } from "./lib/types";

function createFetcher(
  config: { url: string; accessToken: string },
  log: (...args: any[]) => void
) {
  return async function _fetch(path: string, opts: RequestInit) {
    try {
      const URL = `${config.url}/${path}`;
      const reqOpts = {
        ...opts,
        headers: {
          authorization: `Bearer ${config.accessToken}`,
          "Content-Type": "application/json",
          ...opts.headers,
        },
      };

      log(">>>>> fetch ", URL, reqOpts.headers);
      const res = await fetch(URL, reqOpts);
      const json = await res.json();

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

export function createZenblogClient<T>({
  accessToken,
  _url,
  _debug,
}: CreateClientOpts) {
  if (typeof window !== "undefined") {
    throwError(
      "Zenblog is not supported in the browser. Make sure you don't leak your access token."
    );
  }
  if (!accessToken) {
    throwError("accessToken is required");
  }

  const logger = createLogger(_debug || false);
  const fetcher = createFetcher(
    {
      url: _url || "https://api.zenblog.com/api/v1",
      accessToken,
    },
    logger
  );

  type ReqOpts = {
    cache?: RequestInit["cache"];
  };
  return {
    posts: {
      list: async function (opts?: ReqOpts): Promise<Post[]> {
        const posts = await fetcher(`posts`, {
          method: "GET",
          cache: opts?.cache || "default",
        });

        type PostWithT = Post & T;
        return posts as PostWithT[]; // to do: validate
      },
      get: async function (
        { slug }: { slug: string },
        opts?: ReqOpts
      ): Promise<PostWithContent> {
        const post = await fetcher(`posts/${slug}`, {
          method: "GET",
          cache: opts?.cache || "default",
        });

        return post as PostWithContent & T; // to do: export types from api
      },
    },
  };
}
