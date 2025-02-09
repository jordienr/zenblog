import { Author, Category, Post, PostWithContent, Tag } from "./types";
type ApiResponse<T> = {
    data: T;
};
type PaginatedApiResponse<T> = ApiResponse<T> & {
    total: number;
    offset: number;
    limit: number;
};
type CreateClientOpts = {
    blogId: string;
    _url?: string;
    _debug?: boolean;
};
export declare function createZenblogClient({ blogId, _url, _debug, }: CreateClientOpts): {
    posts: {
        list: ({ limit, offset, cache, category, tags, author, }?: {
            cache?: RequestInit["cache"];
            limit?: number;
            offset?: number;
        } & {
            category?: string;
            tags?: string[];
            author?: string;
        }) => Promise<PaginatedApiResponse<Post[]>>;
        get: ({ slug }: {
            slug: string;
        }, opts?: {
            cache?: RequestInit["cache"];
            limit?: number;
            offset?: number;
        }) => Promise<ApiResponse<PostWithContent>>;
    };
    categories: {
        list: () => Promise<PaginatedApiResponse<Category[]>>;
    };
    tags: {
        list: () => Promise<PaginatedApiResponse<Tag[]>>;
    };
    authors: {
        list: () => Promise<PaginatedApiResponse<Author[]>>;
    };
};
export {};
//# sourceMappingURL=index.d.ts.map