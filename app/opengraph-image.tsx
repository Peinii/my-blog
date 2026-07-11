import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Peini's Blog";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Kartu preview saat link blog dibagikan (WhatsApp/X/dll).
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #4361ee 0%, #7c93f5 100%)",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 120, marginBottom: 8 }}>🐱</div>
        <div style={{ fontSize: 72, fontWeight: 700 }}>Peini&apos;s Blog</div>
        <div style={{ fontSize: 30, opacity: 0.85, marginTop: 14 }}>
          notes, stories &amp; things I&apos;m learning ♡
        </div>
      </div>
    ),
    size
  );
}
