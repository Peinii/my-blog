import type { Metadata } from "next";
import SettingsContent from "@/components/SettingsContent";

export const metadata: Metadata = {
  title: "Settings",
  description: "Customize language, appearance and theme.",
};

export default function SettingsPage() {
  return <SettingsContent />;
}
