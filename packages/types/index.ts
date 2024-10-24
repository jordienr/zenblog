export type Post = {
  title: string;
  slug: string;
  published_at: string;
  cover_image?: string;
  excerpt?: string;
  tags: Tag[];
  category: Category | null;
};

export type PostWithContent = Post & {
  html_content: string;
};

export type Category = {
  slug: string;
  name: string;
};

export type Tag = {
  slug: string;
  name: string;
};
