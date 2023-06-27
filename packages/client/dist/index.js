"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClient = void 0;
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
function createClient({ blogId }) {
    const config = getConfig();
    async function _fetch(path, opts) {
        const res = await fetch(`${config.api}/${blogId}/${path}`, opts);
        if (!res.ok) {
            throwError("Error fetching data from API");
        }
        const data = await res.json();
        return data;
    }
    if (!blogId) {
        throwError("blogId is required");
    }
    return {
        posts: {
            getAll: async function () {
                const posts = await _fetch(`/posts`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                return posts;
            },
            getBySlug: async function (slug) {
                const post = await _fetch(`/post/${slug}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                return post;
            },
        },
    };
}
exports.createClient = createClient;
//# sourceMappingURL=index.js.map