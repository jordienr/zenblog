export const isValidBlogId = (blogId: string | undefined): blogId is string => {
  if (!blogId) {
    return false;
  }

  const trimmed = blogId.trim();

  if (trimmed === "") {
    return false;
  }

  if (trimmed.toLowerCase() === "undefined") {
    return false;
  }

  if (trimmed.toLowerCase() === "null") {
    return false;
  }

  return true;
};
