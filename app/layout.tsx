import type { Metadata } from "next";
import "./globals.css";
import { SettingsProvider } from "@/lib/settings-context";
import { siteUrl } from "@/lib/sanity.env";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Pet from "@/components/Pet";
import ScrollTopPaw from "@/components/ScrollTopPaw";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Peini's Blog",
    template: "%s · Peini's Blog",
  },
  description: "Personal blog — notes, stories & things I'm learning.",
  openGraph: {
    title: "Peini's Blog",
    description: "Personal blog — notes, stories & things I'm learning.",
    url: siteUrl,
    siteName: "Peini's Blog",
    type: "website",
  },
  // Minta mesin pencari (Google dll.) untuk TIDAK mengindex blog ini.
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

// Script kecil ini berjalan sebelum halaman digambar,
// supaya dark mode & warna tema tidak "berkedip" saat dibuka.
const themeInit = `
try {
  var s = JSON.parse(localStorage.getItem('peini-settings') || '{}');
  var mode = s.mode || 'system';
  var dark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  if (dark) document.documentElement.classList.add('dark');
  if (s.reduceMotion) document.documentElement.classList.add('reduce-motion');
  document.documentElement.setAttribute('data-accent', s.accent || 'blue');
  document.documentElement.setAttribute('data-textsize', s.textSize || 'm');
  if (s.lang === 'zh') document.documentElement.setAttribute('lang', 'zh-CN');
} catch (e) {}
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-accent="blue" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        {/* Font kaiti untuk mode 中文 — dimuat per-potongan (ringan) */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont@1.7.0/style.css"
        />
      </head>
      <body className="flex min-h-screen flex-col">
        <SettingsProvider>
          <Navbar />
          <main className="mx-auto w-full max-w-4xl flex-1 px-5 pb-16 pt-8">
            {children}
          </main>
          <Footer />
          <Pet />
          <ScrollTopPaw />
        </SettingsProvider>
      </body>
    </html>
  );
}
