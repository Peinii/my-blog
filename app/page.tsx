import { getLatestPosts } from "@/lib/queries";
import HomeContent from "@/components/HomeContent";

export const revalidate = 60;

export default async function HomePage() {
  const posts = await getLatestPosts(3);
  return <HomeContent posts={posts} />;
}
