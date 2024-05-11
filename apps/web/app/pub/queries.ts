import { createClient } from "app/supa";

export async function getBlog(subdomain: string) {
  const supa = createClient();
  console.log("------>>>>> GET BLOG CALLED");
  const { data: blog } = await supa
    .from("blogs")
    .select("title, emoji, description")
    .eq("slug", subdomain)
    .single();

  return blog;
}

export async function getPosts(subdomain: string) {
  const supa = createClient();
  const { data: posts } = await supa
    .from("public_posts_v1")
    .select("title, slug, published_at")
    .eq("blog_slug", subdomain)
    .eq("published", true);

  return posts;
}
