import { authMiddleware } from "@clerk/nextjs";

// regex for /api/public/*
const publicPages = ["/"];

// regex for / only
const regex = new RegExp(`^(${publicPages.join("|")})$`);

export default authMiddleware({
  publicRoutes: [regex],
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
