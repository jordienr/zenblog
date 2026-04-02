import { createPublicApiClient } from "@zenblog/api-client-public";
import { Author, Category, Post, PostWithContent, Tag } from "./types";

type ApiResponse<T> = {
  data: T;
};

type PaginatedApiResponse<T> = ApiResponse<T> & {
  total?: number;
  offset?: number;
  limit?: number;
};

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

  const publicClient = createPublicApiClient({
    baseUrl: _url || "https://zenblog.com/api/public",
  });

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
        return publicClient.posts.list(blogId, {
          limit,
          offset,
          category,
          tags,
          author,
          cache,
        });
      },
      get: async function (
        { slug }: { slug: string },
        opts?: ReqOpts
      ): Promise<ApiResponse<PostWithContent>> {
        return publicClient.posts.get(blogId, slug, {
          cache: opts?.cache || "default",
        });
      },
    },
    categories: {
      list: async function (): Promise<PaginatedApiResponse<Category[]>> {
        return publicClient.categories.list(blogId);
      },
    },
    tags: {
      list: async function (): Promise<PaginatedApiResponse<Tag[]>> {
        return publicClient.tags.list(blogId);
      },
    },
    authors: {
      list: async function (): Promise<PaginatedApiResponse<Author[]>> {
        return publicClient.authors.list(blogId);
      },
      get: async function (
        { slug }: { slug: string },
        opts?: ReqOpts
      ): Promise<ApiResponse<Author>> {
        return publicClient.authors.get(blogId, slug, {
          cache: opts?.cache || "default",
        });
      },
    },
  };
}
