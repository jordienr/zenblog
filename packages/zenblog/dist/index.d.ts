import { Post, PostWithContent, CreateClientOpts } from "./lib/types";
export declare function createZenblogClient<T>({ accessToken, _url, _debug, }: CreateClientOpts): {
    posts: {
        list: (opts?: {
            cache?: RequestInit["cache"];
        } | undefined) => Promise<Post[]>;
        get: ({ slug }: {
            slug: string;
        }, opts?: {
            cache?: RequestInit["cache"];
        } | undefined) => Promise<PostWithContent>;
    };
};
//# sourceMappingURL=index.d.ts.map