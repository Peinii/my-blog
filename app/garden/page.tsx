import type { Metadata } from "next";
import { getPosts } from "@/lib/queries";
import GardenContent from "@/components/GardenContent";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Garden",
  description: "Every post grows a flower.",
};

export default async function GardenPage() {
  const posts = await getPosts();
  return <GardenContent posts={posts} />;
}
