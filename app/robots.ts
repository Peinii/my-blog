import type { MetadataRoute } from "next";

// Blog ini sengaja TIDAK diindex mesin pencari (permintaan pemilik).
// Untuk mengizinkan Google mengindex lagi: kembalikan allow "/" dan
// hapus blok "robots" di app/layout.tsx.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: "/",
    },
  };
}
