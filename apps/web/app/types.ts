import { Post } from "@zenblog/types";

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
  posts: Post[];
  blog: Blog;
  disableLinks?: boolean;
};
