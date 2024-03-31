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
export declare function createClient<T>({ blogId, _url, debug }: CreateClientOpts): {
    posts: {
        getAll: (opts?: {
            cache?: RequestInit["cache"];
        } | undefined) => Promise<Post[]>;
        getBySlug: (slug: string, opts?: {
            cache?: RequestInit["cache"];
        } | undefined) => Promise<PostWithContent>;
    };
};
//# sourceMappingURL=index.d.ts.map