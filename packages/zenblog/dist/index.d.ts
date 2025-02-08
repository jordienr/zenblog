import { Author, Category, Post, PostWithContent, Tag } from "./types";
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
        }) => Promise<{
            data: Post[];
        }>;
        get: ({ slug }: {
            slug: string;
        }, opts?: {
            cache?: RequestInit["cache"];
            limit?: number;
            offset?: number;
        }) => Promise<{
            data: PostWithContent;
        }>;
    };
    categories: {
        list: () => Promise<{
            data: Category[];
        }>;
    };
    tags: {
        list: () => Promise<{
            data: Tag[];
        }>;
    };
    authors: {
        list: () => Promise<{
            data: Author[];
        }>;
    };
};
export {};
//# sourceMappingURL=index.d.ts.map