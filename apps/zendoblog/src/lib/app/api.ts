import { Blog, DeleteBlogRes, PatchBlog } from "@/lib/models/blogs/Blogs";
import { z } from "zod";
import { getPostBySlugRes, getPostsRes } from "../models/posts/Posts";
import { deleteAPIKeysRes, getAPIKeysRes } from "../models/apiKeys/APIKeys";
import { GetBlogRes } from "../models/blogs/Blogs";
import { APIKey } from "../models/apiKeys/APIKeys";
import { JSONContent } from "@tiptap/react";

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

  async function getPostsForBlog(blogId: string) {
    const res = await _fetch(
      `/api/blogs/${blogId}/posts`,
      { method: "GET" },
      getPostsRes
    );

    return res;
  }

  async function getPostBySlug(blogId: string, postSlug: string) {
    const res = await _fetch(
      `/api/blogs/${blogId}/posts/${postSlug}`,
      { method: "GET" },
      getPostBySlugRes
    );

    return res;
  }

  async function deletePostBySlug(blogId: string, postSlug: string) {
    const res = await _fetch(
      `/api/blogs/${blogId}/posts/${postSlug}`,
      { method: "DELETE" },
      z.object({ success: z.boolean() })
    );

    return res;
  }

  async function updatePostBySlug(
    blogId: string,
    postSlug: string,
    body: {
      title: string;
      slug: string;
      published: boolean;
      content: JSONContent;
    }
  ) {
    const res = await _fetch(
      `/api/blogs/${blogId}/posts/${postSlug}`,
      { method: "PATCH", body: JSON.stringify(body) },
      z.object({ success: z.boolean() })
    );

    return res;
  }

  return {
    user: {
      setup: () =>
        _fetch(
          "/api/user/setup",
          { method: "GET" },
          z.object({ success: z.boolean() })
        ),
    },
    blogs: {
      get: getBlog,
      getAll: getBlogs,
      update: patchBlog,
      delete: deleteBlog,
    },
    invitations: {
      create: (blogId: string, name: string, email: string) =>
        _fetch(
          `/api/blogs/${blogId}/invitations`,
          {
            method: "POST",
            body: JSON.stringify({
              name,
              email,
            }),
          },
          z.unknown()
        ),
      getAll: (blogId: string) =>
        _fetch(
          `/api/blogs/${blogId}/invitations`,
          { method: "GET" },
          z.array(
            z.object({
              id: z.string(),
              name: z.string(),
              email: z.string(),
              blog_id: z.string(),
            })
          )
        ),
      delete: (blogId: string, invitationId: string) =>
        _fetch(
          `/api/blogs/${blogId}/invitations/${invitationId}`,
          { method: "DELETE" },
          z.object({ success: z.boolean() })
        ),
    },
    posts: {
      getAll: getPostsForBlog,
      get: getPostBySlug,
      delete: deletePostBySlug,
      update: updatePostBySlug,
    },
  };
}
