import { NextRequest, NextResponse } from "next/server";

// inspired by https://github.com/vercel/platforms/blob/main/middleware.ts

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

const invalidSubdomains = ["www", "localhost:3000", "zenblog", "127"];

export default async function middleware(req: NextRequest) {
  const subdomain = req.headers.get("host")?.split(".")[0];
  const path = req.nextUrl.pathname;

  if (!subdomain || invalidSubdomains.includes(subdomain)) {
    return;
  }

  const newPath = `/pub/${subdomain}${path}`;
  const url = new URL(newPath, req.url);

  return NextResponse.rewrite(url);
}
