"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createZenblogClient = void 0;
const lib_1 = require("./lib");
function createFetcher(config, log) {
    return async function _fetch(path, opts) {
        try {
            const URL = `${config.api}/${path}`;
            const reqOpts = {
                ...opts,
                headers: {
                    authorization: `Bearer ${config.accessToken}`,
                    "Content-Type": "application/json",
                    ...opts.headers,
                },
            };
            log(">>>>> fetch ", URL, reqOpts.headers);
            const res = await fetch(URL, reqOpts);
            const json = await res.json();
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
function createZenblogClient({ accessToken, _url, _debug, }) {
    if (typeof window !== "undefined") {
        (0, lib_1.throwError)("Zenblog is not supported in the browser. Make sure you don't leak your access token.");
    }
    if (!accessToken) {
        (0, lib_1.throwError)("accessToken is required");
    }
    const logger = (0, lib_1.createLogger)(_debug || false);
    const fetcher = createFetcher({
        api: _url || "https://api.zenblog.com",
        accessToken,
    }, logger);
    return {
        posts: {
            list: async function (opts) {
                const posts = await fetcher(`posts`, {
                    method: "GET",
                    cache: opts?.cache || "default",
                });
                return posts; // to do: validate
            },
            get: async function ({ slug }, opts) {
                const post = await fetcher(`posts/${slug}`, {
                    method: "GET",
                    cache: opts?.cache || "default",
                });
                return post; // to do: export types from api
            },
        },
    };
}
exports.createZenblogClient = createZenblogClient;
//# sourceMappingURL=index.js.map