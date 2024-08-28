import { getConfig, createDebugger, throwError } from "./lib";
import { Post, PostWithContent, CreateClientOpts } from "./lib/types";

async function createFetcher(
  config: { api: string; accessToken: string },
  log: (...args: any[]) => void
) {
  return async function _fetch(path: string, opts: RequestInit) {
    try {
      const URL = `${config.api}/${path}`;

      log("fetch ", URL, {
        headers: {
          authorization: `Bearer ${config.accessToken}`,
          "Content-Type": "application/json",
          ...opts.headers,
        },
        ...opts,
      });
      const res = await fetch(URL, opts);
      const json = await res.json();

      if (res.headers.get("zenblog-subscription-status") === "inactive") {
        throwError(
          "Zenblog subscription is inactive. Go to https://zenblog.com to subscribe."
        );
      }
      log("res", {
        status: res.status,
        statusText: res.statusText,
        ok: res.ok,
        json,
      });
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

  const config = getConfig(_url);
  const log = createDebugger(_debug || false);

  if (!accessToken) {
    throwError("accessToken is required");
  }

  type ReqOpts = {
    cache?: RequestInit["cache"];
  };

  return {
    posts: {
      list: async function (opts?: ReqOpts): Promise<Post[]> {
        const posts = await _fetch(`posts`, {
          method: "GET",
          cache: opts?.cache || "default",
        });
        log("posts.getAll", posts);

        type PostWithT = Post & T;
        return posts as PostWithT[]; // to do: validate
      },
      get: async function (
        { slug }: { slug: string },
        opts?: ReqOpts
      ): Promise<PostWithContent> {
        const post = await _fetch(`post/${slug}`, {
          method: "GET",
          cache: opts?.cache || "default",
        });

        log("posts.getBySlug", post);

        return post as PostWithContent & T; // to do: export types from api
      },
    },
  };
}
