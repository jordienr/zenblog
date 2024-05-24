export function getHostedBlogUrl(slug: string) {
  const url = new URL(process.env.NEXT_PUBLIC_BASE_URL || "");
  // add blog slug as subdomain
  // remove www
  if (url.hostname.startsWith("www.")) {
    url.hostname = url.hostname.slice(4);
  }
  url.hostname = `${slug}.${url.hostname}`;
  return url;
}
