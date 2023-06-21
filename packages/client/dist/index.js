const BASE_URL = "http://localhost:3000/api";
function throwError(msg) {
    throw new Error("[🍊] " + msg);
}
export function createClient({ blogId }) {
    if (!blogId) {
        throwError("blogId is required");
    }
    return {
        async getPosts() {
            try {
                const res = await fetch(`http://localhost:3000/api/public/${blogId}/posts`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                console.log('GETPOSTS 1', res);
                if (!res.ok) {
                    console.log('GETPOSTS ERROR', res.status, res.statusText, res);
                    return [];
                }
                const data = await res.json();
                console.log('GETPOSTS 3', data);
                return data;
            }
            catch (error) {
                console.error(error);
                return [];
            }
        },
        async getPost(slug) {
            const res = await fetch(`http://localhost:3000/api/public/${blogId}/post/${slug}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return await res.json();
        },
    };
}
//# sourceMappingURL=index.js.map