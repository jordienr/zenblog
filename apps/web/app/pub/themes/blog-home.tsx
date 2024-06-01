import { Blog, Post, Theme } from "app/types";
import { DefaultHome } from "./default/home";
import { DirectoryHome } from "./directory/home";
import { NewsroomHome } from "./newsroom/home";

export function BlogHomePage({
  theme,
  blog,
  posts,
  disableLinks = false,
}: {
  theme: Theme;
  blog: Blog;
  posts: Post[];
  disableLinks?: boolean;
}) {
  const props = {
    blog,
    posts,
    disableLinks,
  };

  if (theme === "directory") {
    return <DirectoryHome {...props} />;
  } else if (theme === "default") {
    return <DefaultHome {...props} />;
  } else if (theme === "newsroom") {
    return <NewsroomHome {...props} />;
  } else {
    return <DefaultHome {...props} />;
  }
}
