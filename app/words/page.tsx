import type { Metadata } from "next";
import WordsContent from "@/components/WordsContent";

export const metadata: Metadata = {
  title: "My Words",
  description: "Saved vocabulary, flashcards and quiz.",
};

export default function WordsPage() {
  return <WordsContent />;
}
