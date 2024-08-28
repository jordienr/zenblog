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
    accessToken: string;
    _url?: string;
    _debug?: boolean;
};
//# sourceMappingURL=types.d.ts.map