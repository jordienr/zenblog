
type Post = {
  slug: string;
  title: string;
};

type PostData = {
  title: string;
  slug: string;
  content: string;
};

type CreateClientOpts = {
  privateKey: string;
};

export function createClient({ privateKey }: CreateClientOpts) {
  function throwError(msg: string) {
    console.error("[🍊] " + msg);
    throw new Error("[🍊] " + msg);
  }
  
  if (!privateKey) {
    throwError("privateKey is required");
  }
  return {
    async getPosts(): Promise<Post[]> {
      return [
        { title: "How to start a cult", slug: "how-to-start-a-cult" },
        { title: "Cultpreneurship", slug: "cultpreneurship" },
        { title: "Groupthinking essentials", slug: "groupthinking-essentials" },
      ];
    },
    async getPost(id: string): Promise<PostData> {
      return { title: "hello world", slug: "hello-world", content: "..." };
    },
  };
}
