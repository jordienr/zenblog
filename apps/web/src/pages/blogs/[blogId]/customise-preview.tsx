import { usePostsQuery } from "@/queries/posts";
import { BlogHomePage } from "app/pub/themes/blog-home";
import { Blog, Post, Theme } from "app/types";
import { useRouter } from "next/router";

export default function CustomisePreview() {
  const router = useRouter();

  // get props from router
  const theme = router.query.theme as Theme;
  const blog = {
    title: router.query.title,
    description: router.query.description,
    emoji: router.query.emoji,
    twitter: router.query.twitter,
    instagram: router.query.instagram,
    website: router.query.website,
  } as Blog;

  const posts = usePostsQuery();
  const publishedPosts = posts.data?.filter((post) => post.published);

  if (posts.isLoading) return null;

  return (
    <>
      <BlogHomePage
        blog={blog}
        posts={publishedPosts as Post[]}
        theme={theme}
        disableLinks
      />
    </>
  );
}
