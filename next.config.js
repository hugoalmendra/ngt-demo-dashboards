// Hosted at nexgent.academy/ngt-demo-dashboards/ in production.
// Dev mode runs at the root (localhost:3010/) so local work stays simple.
const isProd = process.env.NODE_ENV === "production";
const basePath = isProd ? "/ngt-demo-dashboards" : "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath,
  // Expose basePath to client code so plain <img src> tags can prefix it.
  // (next/link + next/image handle it automatically; <img> does not.)
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};
module.exports = nextConfig;
