import { createClient } from "app/supa";

export async function getBlog(subdomain: string) {
  const supa = createClient();

  const { data: blog } = await supa
    .from("blogs")
    .select("id, title, emoji, description, order")
    .eq("slug", subdomain)
    .single();

  return blog;
}

export async function getPosts(subdomain: string, sort: string = "desc") {
  const supa = createClient();
  const { data: posts } = await supa
    .from("public_posts_v1")
    .select("title, slug, published_at")
    .eq("blog_slug", subdomain)
    .eq("published", true)
    .order("published_at", { ascending: sort === "asc" });

  return posts;
}

export async function getPost(subdomain: string, slug: string) {
  const supa = createClient();
  const { data: post } = await supa
    .from("public_posts_v1")
    .select("title, content, cover_image")
    .eq("slug", slug)
    .eq("blog_slug", subdomain)
    .single();

  return post;
}
