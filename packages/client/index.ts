const BASE_URL = "http://localhost:3000/api";

function throwError(msg: string) {
  throw new Error("[🍊] " + msg);
}

export type Post = {
  slug: string;
  title: string;
  content: any;
};

export type PostWithContent = Post & {
  content: string;
};

export type CreateClientOpts = {
  blogId: string;
};

export function createClient({ blogId }: CreateClientOpts) {
  if (!blogId) {
    throwError("blogId is required");
  }
  return {
    async getPosts(): Promise<Post[]> {
      try {
        const res = await fetch(`http://localhost:3000/api/public/${blogId}/posts`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
        console.log('GETPOSTS 1', res)
        if (!res.ok) {
          console.log('GETPOSTS ERROR', res.status, res.statusText, res)
          return [];
        }
        const data = await res.json()
        console.log('GETPOSTS 3', data)
        return data;
      } catch (error) {
        console.error(error);
        return [];
      }
    },
    async getPost(slug: string): Promise<PostWithContent> {
      const res = await fetch(`http://localhost:3000/api/public/${blogId}/post/${slug}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      return await res.json();
    },
  };
}
