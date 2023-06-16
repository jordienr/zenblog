type Post = {
    slug: string;
    title: string;
};
type PostData = {
    title: string;
    slug: string;
    content: string;
};
type CreateClientOpts = {
    privateKey: string;
};
export declare function createClient({ privateKey }: CreateClientOpts): {
    getPosts(): Promise<Post[]>;
    getPost(id: string): Promise<PostData>;
};
export {};
//# sourceMappingURL=index.d.ts.map