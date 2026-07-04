import type { Metadata } from "next";
import AboutContent from "@/components/AboutContent";

export const metadata: Metadata = {
  title: "About",
  description: "About Peini.",
};

export default function AboutPage() {
  return <AboutContent />;
}
