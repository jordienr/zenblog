import type { Author, Category, Post, PostWithContent, Tag } from "@zenblog/types";
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
export declare function createPublicApiClient({ baseUrl, headers, }?: RequestOptions): {
    posts: {
        list(blogId: string, options?: PostListOptions): Promise<PaginatedApiResponse<Post[]>>;
        get(blogId: string, slug: string, options?: {
            cache?: RequestCache;
        }): Promise<ApiResponse<PostWithContent>>;
    };
    categories: {
        list(blogId: string): Promise<PaginatedApiResponse<Category[]>>;
    };
    tags: {
        list(blogId: string): Promise<PaginatedApiResponse<Tag[]>>;
    };
    authors: {
        list(blogId: string): Promise<PaginatedApiResponse<Author[]>>;
        get(blogId: string, slug: string, options?: {
            cache?: RequestCache;
        }): Promise<ApiResponse<Author>>;
    };
};
export {};
//# sourceMappingURL=index.d.ts.map