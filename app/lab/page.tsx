import type { Metadata } from "next";
import PhotoLab from "@/components/PhotoLab";

export const metadata: Metadata = {
  title: "Photo Lab",
  description: "Dither, halftone, pixel & ASCII effects — in your browser.",
};

export default function LabPage() {
  return <PhotoLab />;
}
