export type Post = {
    slug: string;
    title: string;
    excerpt?: string;
    cover_image?: string;
    published_at: string;
    tags: {
        name: string;
        slug: string;
    }[] | [];
    category: {
        name: string;
        slug: string;
    } | null;
};
export type PostWithContent = Post & {
    html_content: string;
};
export type CreateClientOpts = {
    accessToken: string;
    blogId: string;
    _url?: string;
    _debug?: boolean;
};
//# sourceMappingURL=types.d.ts.map