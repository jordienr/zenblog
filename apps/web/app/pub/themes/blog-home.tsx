import { Blog, Post, Theme } from "app/types";
import { DefaultHome } from "./default/home";
import { DirectoryHome } from "./directory/home";
import { NewsroomHome } from "./newsroom/home";
import { GardenHome } from "./garden/home";
import { InstrumentHome } from "./instrument/home";

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
  } else if (theme === "garden") {
    return <GardenHome {...props} />;
  } else if (theme === "instrument") {
    return <InstrumentHome {...props} />;
  } else {
    return <DefaultHome {...props} />;
  }
}
