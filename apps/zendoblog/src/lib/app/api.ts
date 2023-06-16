import { Blog, DeleteBlogRes, PatchBlog } from "@/lib/models/blogs/Blogs";
import { z } from "zod";
import { getPostsRes } from "../models/posts/Posts";
import { deleteAPIKeysRes, getAPIKeysRes } from "../models/apiKeys/APIKeys";
import { GetBlogRes } from "../models/blogs/Blogs";
import { APIKey } from "../models/apiKeys/APIKeys";

export function createAPIClient() {
  async function _fetch<T extends z.ZodTypeAny>(
    input: RequestInfo,
    init: RequestInit,
    type: T
  ): Promise<z.infer<T>> {
    const headers = new Headers(init?.headers);
    const res = await fetch(input, { ...init, headers });

    console.log(`[🛫 Req ${init.method} ${input}] `, init.body);

    if (!res.ok) {
      console.error(`[🚨 ${init.method} ${input}] `, res.statusText);
      throw new Error(res.statusText);
    }
    const data = await res.json();
    console.log(`[✅ Res ${init.method} ${input}] `, data);

    const result = await type.safeParseAsync(data);

    if (!result.success) {
      console.error(`[ZOD] `, result.error.message, data);
      throw new Error(result.error.message);
    }

    return result.data;
  }

  async function getBlogs() {
    const res = await _fetch("/api/blogs", { method: "GET" }, z.array(Blog));

    return res;
  }

  async function getBlog(slug: string) {
    const res = await _fetch(
      `/api/blogs/${slug}`,
      { method: "GET" },
      GetBlogRes
    );

    return res;
  }

  async function deleteBlog(slug: string) {
    const res = await _fetch(
      `/api/blogs/${slug}`,
      { method: "DELETE" },
      DeleteBlogRes
    );

    return res;
  }

  async function patchBlog(slug: string, body: PatchBlog) {
    const res = await _fetch(
      `/api/blogs/${slug}`,
      { method: "PATCH", body: JSON.stringify(body) },
      GetBlogRes
    );

    return res;
  }

  async function getPostsForBlog(blogSlug: string) {
    console.log("blogSlug", blogSlug);

    const res = await _fetch(
      `/api/blogs/${blogSlug}/posts`,
      { method: "GET" },
      getPostsRes
    );

    return res;
  }

  async function getAPIKeysForBlog(blogSlug: string) {
    const res = await _fetch(
      `/api/blogs/${blogSlug}/api-keys`,
      { method: "GET" },
      getAPIKeysRes
    );

    return res;
  }

  async function postApiKey(blogSlug: string, apiKeyName: string) {
    const res = await _fetch(
      `/api/blogs/${blogSlug}/api-keys`,
      { method: "POST", body: JSON.stringify({ name: apiKeyName }) },
      APIKey
    );

    return res;
  }

  async function deleteApiKey(key: string) {
    const res = await _fetch(
      `/api/api-keys/${key}`,
      { method: "DELETE" },
      deleteAPIKeysRes
    );

    return res;
  }

  return {
    blogs: {
      get: getBlog,
      getAll: getBlogs,
      update: patchBlog,
      delete: deleteBlog,
    },
    posts: {
      getAll: getPostsForBlog,
    },
    apiKeys: {
      getAll: getAPIKeysForBlog,
      create: postApiKey,
      delete: deleteApiKey,
    },
  };
}
