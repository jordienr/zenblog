/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  transpilePackages: [ "react-syntax-highlighter" ],
  images: {
    remotePatterns: [
      { hostname: "images.zenblog.com", protocol: "https", port: "", pathname: "/**" },
      { hostname: "ppfseefimhneysnokffx.supabase.co", protocol: "https", port: "", pathname: "/**" },
    ],
  },
};
export default config;
