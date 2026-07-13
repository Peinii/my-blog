/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  // Sertakan file kamus ke function /api/dict (beberapa varian kunci
  // untuk kompatibilitas; kalaupun meleset, loader fallback ke CDN).
  experimental: {
    outputFileTracingIncludes: {
      "/api/dict": ["./public/dict/**"],
      "/api/dict/route": ["./public/dict/**"],
    },
  },
};

export default nextConfig;
