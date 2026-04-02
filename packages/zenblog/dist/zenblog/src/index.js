"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createZenblogClient = createZenblogClient;
const api_client_public_1 = require("@zenblog/api-client-public");
function createZenblogClient({ blogId, _url, _debug, }) {
    if (typeof window !== "undefined") {
        console.warn("Looks like you're trying to use Zenblog in the browser. This is not advised. We recommend using server-side rendering frameworks to fetch data.");
    }
    const publicClient = (0, api_client_public_1.createPublicApiClient)({
        baseUrl: _url || "https://zenblog.com/api/public",
    });
    return {
        posts: {
            list: async function ({ limit = 20, offset = 0, cache = "default", category, tags, author, } = {}) {
                return publicClient.posts.list(blogId, {
                    limit,
                    offset,
                    category,
                    tags,
                    author,
                    cache,
                });
            },
            get: async function ({ slug }, opts) {
                return publicClient.posts.get(blogId, slug, {
                    cache: opts?.cache || "default",
                });
            },
        },
        categories: {
            list: async function () {
                return publicClient.categories.list(blogId);
            },
        },
        tags: {
            list: async function () {
                return publicClient.tags.list(blogId);
            },
        },
        authors: {
            list: async function () {
                return publicClient.authors.list(blogId);
            },
            get: async function ({ slug }, opts) {
                return publicClient.authors.get(blogId, slug, {
                    cache: opts?.cache || "default",
                });
            },
        },
    };
}
//# sourceMappingURL=index.js.map