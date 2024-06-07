import { createClient } from "app/supa";

export async function getBlog(subdomain: string) {
  const supa = createClient();

  const res = await supa
    .from("blogs")
    .select("id, title, emoji, description, order, theme")
    .eq("slug", subdomain)
    .single();

  return res;
}

export async function getPosts(subdomain: string, sort: string = "desc") {
  const supa = createClient();
  const res = await supa
    .from("public_posts_v3")
    .select("title, slug, published_at, cover_image, abstract")
    .eq("blog_slug", subdomain)
    .eq("published", true)
    .order("published_at", { ascending: sort === "asc" });

  return res as unknown as {
    data: {
      title: string;
      slug: string;
      published_at: string;
      cover_image: string;
    }[];
    error: any;
  };
}

export async function getPost(subdomain: string, slug: string) {
  const supa = createClient();
  const { data: post } = await supa
    .from("public_posts_v2")
    .select(
      "title, content, cover_image, published_at, created_at, html_content"
    )
    .eq("slug", slug)
    .eq("blog_slug", subdomain)
    .single();

  return post;
}
