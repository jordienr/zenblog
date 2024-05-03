function logError(...args: any[]) {
  console.error("[zenblog error] ", ...args);
}

function throwError(msg: string, ...args: any[]) {
  logError(msg, ...args);
  throw new Error("[zenblog error] " + msg);
}

function createDebugger(debug: boolean) {
  return (...args: any[]) => {
    if (debug) {
      console.log("[🍊] ", ...args);
    }
  };
}

function getConfig(url?: string): { api: string } {
  if (url) {
    return {
      api: url,
    };
  }
  return {
    api: "https://www.zenblog.com/api/public",
  };
}

export type Post = {
  slug: string;
  title: string;
  content?: any;
  cover_image?: string;
  created_at: string;
  updated_at: string;
  published_at: string;
};

export type PostWithContent = Post & {
  content: any;
};

export type CreateClientOpts = {
  blogId: string;
  _url?: string;
  debug?: boolean;
};

export function createZenblogClient<T>({
  blogId,
  _url,
  debug,
}: CreateClientOpts) {
  const config = getConfig(_url);
  const log = createDebugger(debug || false);
  log("createClient ", config);

  async function _fetch(path: string, opts: RequestInit) {
    try {
      const URL = `${config.api}/${blogId}/${path}`;
      console.log("URL", URL);

      log("fetching ", URL, opts);
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
  }

  if (!blogId) {
    throwError("blogId is required");
  }

  type ReqOpts = {
    cache?: RequestInit["cache"];
  };

  return {
    posts: {
      list: async function (opts?: ReqOpts): Promise<Post[]> {
        const posts = await _fetch(`posts`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: opts?.cache || "default",
        });
        log("posts.getAll", posts);

        type PostWithT = Post & T;
        return posts as PostWithT[]; // to do: validate
      },
      get: async function (
        slug: string,
        opts?: ReqOpts
      ): Promise<PostWithContent> {
        const post = await _fetch(`post/${slug}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: opts?.cache || "default",
        });

        log("posts.getBySlug", post);

        return post as PostWithContent & T; // to do: validate
      },
    },
  };
}
