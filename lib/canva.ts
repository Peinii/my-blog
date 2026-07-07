// Ubah link share Canva apa pun menjadi URL embed yang aman.
// Hanya menerima domain canva.com (keamanan: tolak iframe dari domain lain).
// Contoh masukan yang diterima:
//   https://www.canva.com/design/DAGabc123/XyZ/view?utm_content=...
//   https://www.canva.com/design/DAGabc123/XyZ/edit
// Hasil: https://www.canva.com/design/DAGabc123/XyZ/view?embed
export function canvaEmbedUrl(raw?: string): string | null {
  if (!raw) return null;
  try {
    const u = new URL(raw);
    if (!/(^|\.)canva\.com$/i.test(u.hostname)) return null;
    if (!u.pathname.includes("/design/")) return null;

    let path = u.pathname.replace(/\/+$/, "");
    if (path.endsWith("/edit")) path = path.slice(0, -5) + "/view";
    if (!path.endsWith("/view")) path += "/view";

    return `https://www.canva.com${path}?embed`;
  } catch {
    return null;
  }
}
