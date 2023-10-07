import { create } from "zustand";
import { Blog, DeleteBlogRes, PatchBlog } from "@/lib/models/blogs/Blogs";
import { z } from "zod";
import { getPostBySlugRes, getPostsRes } from "../models/posts/Posts";
import { GetBlogRes } from "../models/blogs/Blogs";
import { JSONContent } from "@tiptap/react";

export type UpdatePostBody = {
  title?: string;
  slug?: string;
  published?: boolean;
  content?: JSONContent;
  cover_image?: string;
};

export function createAPIClient() {
  async function _fetch<T extends z.ZodTypeAny>(
    input: RequestInfo,
    init: RequestInit,
    type: T
  ): Promise<z.infer<T>> {
    const headers = new Headers(init?.headers);
    const URL_START = "/api/v1";
    const res = await fetch(URL_START + input, { ...init, headers });

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
    const res = await _fetch("/blogs", { method: "GET" }, z.array(Blog));

    return res;
  }

  async function getBlog(slug: string) {
    const res = await _fetch(`/blogs/${slug}`, { method: "GET" }, GetBlogRes);

    return res;
  }

  async function deleteBlog(slug: string) {
    const res = await _fetch(
      `/blogs/${slug}`,
      { method: "DELETE" },
      DeleteBlogRes
    );

    return res;
  }

  async function patchBlog(slug: string, body: PatchBlog) {
    const res = await _fetch(
      `/blogs/${slug}`,
      { method: "PATCH", body: JSON.stringify(body) },
      GetBlogRes
    );

    return res;
  }

  async function createBlog({
    title,
    description,
    emoji,
  }: {
    title: string;
    description: string;
    emoji: string;
  }) {
    const res = await _fetch(
      "/blogs",
      {
        method: "POST",
        body: JSON.stringify({
          title,
          description,
          emoji,
        }),
      },
      z.null()
    );

    return res;
  }

  async function getPostsForBlog(blogId: string) {
    const res = await _fetch(
      `/blogs/${blogId}/posts`,
      { method: "GET" },
      getPostsRes
    );

    return res;
  }

  async function getPostBySlug(blogId: string, postSlug: string) {
    const res = await _fetch(
      `/blogs/${blogId}/posts/${postSlug}`,
      { method: "GET" },
      getPostBySlugRes
    );

    return res;
  }

  async function deletePostBySlug(blogId: string, postSlug: string) {
    const res = await _fetch(
      `/blogs/${blogId}/posts/${postSlug}`,
      { method: "DELETE" },
      z.object({ success: z.boolean() })
    );

    return res;
  }

  async function updatePostBySlug(
    blogId: string,
    postSlug: string,
    body: UpdatePostBody
  ) {
    const res = await _fetch(
      `/blogs/${blogId}/posts/${postSlug}`,
      { method: "PATCH", body: JSON.stringify(body) },
      z.object({ success: z.boolean() })
    );

    return res;
  }

  // TODO!: move these methods to separate files this is getting too big
  return {
    user: {
      setup: () =>
        _fetch(
          "/user/setup",
          { method: "GET" },
          z.object({ success: z.boolean() })
        ),
    },
    blogs: {
      get: getBlog,
      getAll: getBlogs,
      update: patchBlog,
      delete: deleteBlog,
      create: createBlog,
    },
    invitations: {
      create: (blogId: string, name: string, email: string) =>
        _fetch(
          `/blogs/${blogId}/invitations`,
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
          `/blogs/${blogId}/invitations`,
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
          `/blogs/${blogId}/invitations/${invitationId}`,
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
    images: {
      getAll: (blogId: string) =>
        _fetch(
          `/blogs/${blogId}/images`,
          { method: "GET" },
          z.array(
            z.object({
              id: z.string(),
              name: z.string(),
              url: z.string(),
              createdAt: z.string(),
              updatedAt: z.string(),
            })
          )
        ),

      upload(blogId: string, file: File) {
        const body = new FormData();
        body.append("file", file);

        console.log("APIC: ", body);
        return _fetch(
          `/upload`,
          { method: "POST", body: JSON.stringify(body) },
          z.any()
        );
      },
    },
  };
}
