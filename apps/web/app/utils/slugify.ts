export const slugify = (text: string) => {
  return text
    .toLowerCase()
    .replace(/ /g, "-") // Replace spaces with -
    .replace(/\//g, "-") // Replace forward slashes with hyphens (moved up)
    .replace(/\\/g, "-") // Replace backslashes with hyphens (moved up)
    .replace(/[^\w\s-]/g, "") // Remove non-word characters
    .replace(/-+/g, "-") // Replace multiple - with a single -
    .replace(/^-+/, "") // Remove leading -
    .replace(/-+$/, ""); // Remove trailing -
};
