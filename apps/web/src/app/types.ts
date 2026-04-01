export type Theme = "directory" | "default" | "newsroom";

export type Blog = {
  emoji: string;
  title: string;
  description: string;
  twitter?: string;
  instagram?: string;
  website?: string;
};

export type BlogHomeProps = {
  posts: {
    title: string;
    slug: string;
    published_at: string;
    cover_image: string;
    excerpt: string;
  }[];
  blog: Blog;
  disableLinks?: boolean;
};
