"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createZenblogClient = createZenblogClient;
const lib_1 = require("./lib");
function toQueryString(obj) {
    const params = new URLSearchParams(obj);
    return params.toString();
}
function createFetcher(config, log) {
    return async function _fetch(path, opts) {
        try {
            const URL = `${config.url}/blogs/${config.blogId}/${path}`;
            const reqOpts = {
                ...opts,
                headers: {
                    "Content-Type": "application/json",
                    ...opts.headers,
                },
            };
            log("fetch ", URL, reqOpts.method);
            const res = await fetch(URL, reqOpts);
            let json;
            try {
                json = await res.json();
            }
            catch (e) {
                (0, lib_1.throwError)("Failed to parse JSON response from API", e);
            }
            if (!res.ok) {
                (0, lib_1.throwError)("Error fetching data from API", res);
            }
            return json;
        }
        catch (error) {
            console.error("[Zenblog Error] ", error);
            throw error;
        }
    };
}
function createZenblogClient({ blogId, _url, _debug, }) {
    if (typeof window !== "undefined") {
        (0, lib_1.throwError)("Zenblog is not supported in the browser. Make sure you don't leak your access token.");
    }
    const logger = (0, lib_1.createLogger)(_debug || false);
    const fetcher = createFetcher({
        url: _url || "https://zenblog.com/api/public",
        blogId,
    }, logger);
    return {
        posts: {
            list: async function ({ limit = 20, offset = 0, cache = "default", category, } = {}) {
                const data = await fetcher(`posts?${toQueryString({
                    limit,
                    offset,
                    ...(category ? { category } : {}),
                })}`, {
                    method: "GET",
                    cache,
                });
                return data;
            },
            get: async function ({ slug }, opts) {
                const post = await fetcher(`posts/${slug}`, {
                    method: "GET",
                    cache: opts?.cache || "default",
                });
                return post;
            },
        },
        categories: {
            list: async function () {
                const data = await fetcher(`categories`, {
                    method: "GET",
                });
                return data;
            },
        },
        tags: {
            list: async function () {
                const data = await fetcher(`tags`, {
                    method: "GET",
                });
                return data;
            },
        },
    };
}
//# sourceMappingURL=index.js.map