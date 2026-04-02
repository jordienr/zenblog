import type {
  Author,
  Category,
  Post,
  PostWithContent,
  Tag,
} from "@zenblog/types";

type ApiResponse<T> = {
  data: T;
};

type PaginatedApiResponse<T> = ApiResponse<T> & {
  total?: number;
  offset?: number;
  limit?: number;
};

type RequestOptions = {
  baseUrl?: string;
  headers?: HeadersInit;
};

type PostListOptions = {
  limit?: number;
  offset?: number;
  category?: string;
  tags?: string[];
  author?: string;
  cache?: RequestCache;
};

function toQueryString(input: Record<string, string | number | undefined>) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(input)) {
    if (value === undefined) {
      continue;
    }

    params.set(key, String(value));
  }

  return params.toString();
}

export function createPublicApiClient({
  baseUrl = "https://zenblog.com/api/public",
  headers,
}: RequestOptions = {}) {
  async function request<T>(path: string, init?: RequestInit) {
    const response = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...headers,
        ...init?.headers,
      },
    });

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json?.message || "Public API request failed");
    }

    return json as T;
  }

  return {
    posts: {
      list(blogId: string, options: PostListOptions = {}) {
        return request<PaginatedApiResponse<Post[]>>(
          `/blogs/${blogId}/posts?${toQueryString({
            limit: options.limit,
            offset: options.offset,
            category: options.category,
            tags: options.tags?.join(","),
            author: options.author,
          })}`,
          { method: "GET", cache: options.cache || "default" }
        );
      },
      get(blogId: string, slug: string, options?: { cache?: RequestCache }) {
        return request<ApiResponse<PostWithContent>>(
          `/blogs/${blogId}/posts/${slug}`,
          { method: "GET", cache: options?.cache || "default" }
        );
      },
    },
    categories: {
      list(blogId: string) {
        return request<PaginatedApiResponse<Category[]>>(
          `/blogs/${blogId}/categories`,
          { method: "GET" }
        );
      },
    },
    tags: {
      list(blogId: string) {
        return request<PaginatedApiResponse<Tag[]>>(`/blogs/${blogId}/tags`, {
          method: "GET",
        });
      },
    },
    authors: {
      list(blogId: string) {
        return request<PaginatedApiResponse<Author[]>>(
          `/blogs/${blogId}/authors`,
          { method: "GET" }
        );
      },
      get(blogId: string, slug: string, options?: { cache?: RequestCache }) {
        return request<ApiResponse<Author>>(
          `/blogs/${blogId}/authors/${slug}`,
          { method: "GET", cache: options?.cache || "default" }
        );
      },
    },
  };
}

