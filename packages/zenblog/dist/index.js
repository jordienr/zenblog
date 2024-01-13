"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClient = void 0;
function logError(...args) {
    console.error("[🍊] ", ...args);
}
function createDebugger(debug) {
    return (...args) => {
        if (debug) {
            console.log("[🍊] ", ...args);
        }
    };
}
function getConfig(url) {
    if (url) {
        return {
            api: url,
        };
    }
    return {
        api: "https://zenblog.com/api/public",
    };
}
function throwError(msg, ...args) {
    logError(msg, ...args);
    throw new Error("[🚨] " + msg);
}
function createClient({ blogId, _url, debug }) {
    const config = getConfig(_url);
    const log = createDebugger(debug || false);
    log("createClient ", config);
    async function _fetch(path, opts) {
        const URL = `${config.api}/${blogId}/${path}`;
        log("fetching ", URL, opts);
        const res = await fetch(URL, opts);
        const json = await res.json();
        log("res", {
            status: res.status,
            statusText: res.statusText,
            ok: res.ok,
            json,
        });
        if (!res.ok) {
            throwError("Error fetching data from API", res);
        }
        return json;
    }
    if (!blogId) {
        throwError("blogId is required");
    }
    return {
        posts: {
            getAll: async function () {
                const posts = await _fetch(`posts`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                log("posts.getAll", posts);
                const normalizedPosts = posts.map((post) => {
                    return {
                        slug: post.slug,
                        title: post.title,
                        created_at: post.created_at,
                        updated_at: post.updated_at,
                        cover_image: post.cover_image,
                    };
                });
                return normalizedPosts; // to do: validate
            },
            getBySlug: async function (slug) {
                const post = await _fetch(`post/${slug}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                return post; // to do: validate
            },
        },
    };
}
exports.createClient = createClient;
//# sourceMappingURL=index.js.map