/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  // Sertakan file kamus (data/) ke dalam serverless function /api/dict
  experimental: {
    outputFileTracingIncludes: {
      "/api/dict": ["./data/**"],
    },
  },
};

export default nextConfig;
