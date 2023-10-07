export function generateSlug(title: string): string {
  const normalizedTitle: string = title.toLowerCase().replace(/[^\w\s]/g, "");
  const slug: string = normalizedTitle.replace(/\s+/g, "-");

  // Replace accented characters with their non-accented counterparts
  // https://stackoverflow.com/a/37511463/3015595
  const normalizedSlug = slug
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/-$/, "");

  return normalizedSlug;
}
