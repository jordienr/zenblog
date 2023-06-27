const env = process.env.NODE_ENV || "development";
const config: Record<
  string,
  {
    api: string;
  }
> = {
  development: {
    api: "http://localhost:3000/api/public",
  },
  production: {
    api: "https://zendo.blog/api/public",
  },
};

function logError(msg: string) {
  console.error("[🍊] ", msg);
}

function getConfig() {
  return config[env];
}

function throwError(msg: string) {
  logError(msg);
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
  const config = getConfig();

  async function _fetch(path: string, opts: RequestInit) {
    const res = await fetch(`${config.api}/${blogId}/${path}`, opts);
    if (!res.ok) {
      throwError("Error fetching data from API");
    }
    const data = await res.json();
    return data;
  }

  if (!blogId) {
    throwError("blogId is required");
  }

  return {
    posts: {
      getAll: async function (): Promise<Post[]> {
        const posts = await _fetch(`/posts`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        return posts as Post[];
      },
      getBySlug: async function (slug: string): Promise<PostWithContent> {
        const post = await _fetch(`/post/${slug}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        return post as PostWithContent;
      },
    },
  };
}
