import { createClient } from "app/supa";

export async function getBlog(subdomain: string) {
  const supa = createClient();

  const res = await supa
    .from("blogs")
    .select(
      "id, title, emoji, description, order, theme, twitter, instagram, website"
    )
    .eq("slug", subdomain)
    .single();

  return res;
}

export async function getPosts(subdomain: string, sort: string = "desc") {
  const supa = createClient();
  const res = await supa
    .from("posts_v5")
    .select("title, slug, published_at, cover_image, excerpt")
    .eq("blog_slug", subdomain)
    .eq("published", true)
    .order("published_at", { ascending: sort === "asc" });

  return res as {
    data: {
      title: string;
      slug: string;
      published_at: string;
      cover_image: string;
      excerpt: string;
    }[];
    error: any;
  };
}

export async function getPost(subdomain: string, slug: string) {
  const supa = createClient();
  const { data: post } = await supa
    .from("posts_v5")
    .select("title, cover_image, published_at, created_at, html_content")
    .eq("slug", slug)
    .eq("published", true)
    .eq("blog_slug", subdomain)
    .single();

  return post;
}
