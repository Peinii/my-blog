"use client";

// Halaman admin (Sanity Studio) — buka /studio untuk menulis & publish artikel.
import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";

export const dynamic = "force-static";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
