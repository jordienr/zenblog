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
        api: "https://www.zenblog.com/api/public",
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
        try {
            const URL = `${config.api}/${blogId}/${path}`;
            console.log("URL", URL);
            log("fetching ", URL, opts);
            const res = await fetch(URL, opts);
            const json = await res.json();
            // if (res.headers.get("zenblog-subscription-status") === "inactive") {
            //   throwError(
            //     "Zenblog subscription is inactive. Go to https://zenblog.com to subscribe."
            //   );
            // }
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
        catch (error) {
            console.error("[Zenblog Error] ", error);
            throw error;
        }
    }
    if (!blogId) {
        throwError("blogId is required");
    }
    return {
        posts: {
            getAll: async function (opts) {
                const posts = await _fetch(`posts`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    cache: opts?.cache || "default",
                });
                log("posts.getAll", posts);
                return posts; // to do: validate
            },
            getBySlug: async function (slug, opts) {
                const post = await _fetch(`post/${slug}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    cache: opts?.cache || "default",
                });
                log("posts.getBySlug", post);
                return post; // to do: validate
            },
        },
    };
}
exports.createClient = createClient;
//# sourceMappingURL=index.js.map