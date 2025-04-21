import { createLogger, throwError } from "./lib";
import { Author, Category, Post, PostWithContent, Tag } from "./types";

type ApiResponse<T> = {
  data: T;
};

type PaginatedApiResponse<T> = ApiResponse<T> & {
  total: number;
  offset: number;
  limit: number;
};

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
    console.warn(
      "Looks like you're trying to use Zenblog in the browser. This is not advised. We recommend using server-side rendering frameworks to fetch data."
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

  type PostListOpts = ReqOpts & {
    category?: string;
    tags?: string[];
    author?: string;
  };
  return {
    posts: {
      list: async function ({
        limit = 20,
        offset = 0,
        cache = "default",
        category,
        tags,
        author,
      }: PostListOpts = {}): Promise<PaginatedApiResponse<Post[]>> {
        const data = await fetcher(
          `posts?${toQueryString({
            limit,
            offset,
            ...(category ? { category } : {}),
            ...(tags ? { tags: tags.join(",") } : {}),
            ...(author ? { author } : {}),
          })}`,
          {
            method: "GET",
            cache,
          }
        );

        return data as PaginatedApiResponse<Post[]>;
      },
      get: async function (
        { slug }: { slug: string },
        opts?: ReqOpts
      ): Promise<ApiResponse<PostWithContent>> {
        const post = await fetcher(`posts/${slug}`, {
          method: "GET",
          cache: opts?.cache || "default",
        });

        return post as ApiResponse<PostWithContent>;
      },
    },
    categories: {
      list: async function (): Promise<PaginatedApiResponse<Category[]>> {
        const data = await fetcher(`categories`, {
          method: "GET",
        });

        return data as PaginatedApiResponse<Category[]>;
      },
    },
    tags: {
      list: async function (): Promise<PaginatedApiResponse<Tag[]>> {
        const data = await fetcher(`tags`, {
          method: "GET",
        });

        return data as PaginatedApiResponse<Tag[]>;
      },
    },
    authors: {
      list: async function (): Promise<PaginatedApiResponse<Author[]>> {
        const data = await fetcher(`authors`, {
          method: "GET",
        });

        return data as PaginatedApiResponse<Author[]>;
      },
      get: async function (
        { slug }: { slug: string },
        opts?: ReqOpts
      ): Promise<ApiResponse<Author>> {
        const data = await fetcher(`authors/${slug}`, {
          method: "GET",
          cache: opts?.cache || "default",
        });

        return data as ApiResponse<Author>;
      },
    },
  };
}
