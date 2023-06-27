const env = process.env.NODE_ENV || "development";
const config = {
    development: {
        api: "http://localhost:3000/api/public",
    },
    production: {
        api: "https://zendo.blog/api/public",
    },
};
function logError(msg) {
    console.error("[🍊] ", msg);
}
function getConfig() {
    return config[env];
}
function throwError(msg) {
    logError(msg);
    throw new Error("[🍊] " + msg);
}
export function createClient({ blogId }) {
    const config = getConfig();
    async function _fetch(path, opts) {
        const res = await fetch(`${config.api}/${blogId}/${path}`, opts);
        if (!res.ok) {
            throwError("Error fetching");
        }
        const data = await res.json();
        return data;
    }
    if (!blogId) {
        throwError("blogId is required");
    }
    return {
        async getPosts() {
            const posts = await _fetch(`/posts`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return posts;
        },
        async getPost(slug) {
            const post = await _fetch(`/post/${slug}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return post;
        },
    };
}
//# sourceMappingURL=index.js.map