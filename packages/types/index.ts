export type Post = {
  title: string;
  slug: string;
  published_at: string;
  cover_image?: string;
  excerpt?: string;
  tags: Tag[];
  category: Category | null;
  authors: Author[];
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

export type Author = {
  name: string;
  slug: string;
  image_url: string;
  bio?: string;
  twitter_url?: string;
  website_url?: string;
};
