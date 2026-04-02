"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPublicApiClient = createPublicApiClient;
function toQueryString(input) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(input)) {
        if (value === undefined) {
            continue;
        }
        params.set(key, String(value));
    }
    return params.toString();
}
function createPublicApiClient({ baseUrl = "https://zenblog.com/api/public", headers, } = {}) {
    async function request(path, init) {
        const response = await fetch(`${baseUrl}${path}`, {
            ...init,
            headers: {
                "Content-Type": "application/json",
                ...headers,
                ...init?.headers,
            },
        });
        const json = await response.json();
        if (!response.ok) {
            throw new Error(json?.message || "Public API request failed");
        }
        return json;
    }
    return {
        posts: {
            list(blogId, options = {}) {
                return request(`/blogs/${blogId}/posts?${toQueryString({
                    limit: options.limit,
                    offset: options.offset,
                    category: options.category,
                    tags: options.tags?.join(","),
                    author: options.author,
                })}`, { method: "GET", cache: options.cache || "default" });
            },
            get(blogId, slug, options) {
                return request(`/blogs/${blogId}/posts/${slug}`, { method: "GET", cache: options?.cache || "default" });
            },
        },
        categories: {
            list(blogId) {
                return request(`/blogs/${blogId}/categories`, { method: "GET" });
            },
        },
        tags: {
            list(blogId) {
                return request(`/blogs/${blogId}/tags`, {
                    method: "GET",
                });
            },
        },
        authors: {
            list(blogId) {
                return request(`/blogs/${blogId}/authors`, { method: "GET" });
            },
            get(blogId, slug, options) {
                return request(`/blogs/${blogId}/authors/${slug}`, { method: "GET", cache: options?.cache || "default" });
            },
        },
    };
}
//# sourceMappingURL=index.js.map