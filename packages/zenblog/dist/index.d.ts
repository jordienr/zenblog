import { Category, Post, PostWithContent, Tag } from "@zenblog/types";
type CreateClientOpts = {
    accessToken: string;
    blogId: string;
    _url?: string;
    _debug?: boolean;
};
export declare function createZenblogClient({ accessToken, blogId, _url, _debug, }: CreateClientOpts): {
    posts: {
        list: ({ limit, offset, cache }?: {
            cache?: RequestInit["cache"];
            limit?: number | undefined;
            offset?: number | undefined;
        }) => Promise<{
            data: Post[];
        }>;
        get: ({ slug }: {
            slug: string;
        }, opts?: {
            cache?: RequestInit["cache"];
            limit?: number | undefined;
            offset?: number | undefined;
        } | undefined) => Promise<{
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
};
export {};
//# sourceMappingURL=index.d.ts.map