import { authMiddleware } from "@clerk/nextjs";

// regex for /api/public/*
const publicPages = ["/", "/api/public/:path*"];

// regex for / only
const regex = new RegExp(`^(${publicPages.join("|")})$`);

console.log("MIDDLEWARE", regex);
export default authMiddleware({
  publicRoutes: ["/", "/api/public/:path*"],
  debug: false,
  beforeAuth(req, res) {
    const isAPI = req.url.includes("/api");
    if (isAPI) {
      console.log("API 🪵", req.method, req.url);
      return;
    }
    console.log("🪵", req.method, req.url);
    return;
  },
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
