export type Theme = "directory" | "default" | "newsroom";

export type Blog = {
  emoji: string;
  title: string;
  description: string;
};
export type Post = {
  cover_image: string;
  title: string;
  published_at: string;
  slug: string;
};

export type BlogHomeProps = {
  posts: Post[];
  blog: Blog;
  disableLinks?: boolean;
};
