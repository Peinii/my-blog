import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Peini's Blog",
    short_name: "Peini",
    description: "Personal blog — notes, stories & things I'm learning.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#4361ee",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
