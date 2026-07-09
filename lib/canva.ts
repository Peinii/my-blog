// Ubah link share Canva apa pun menjadi URL embed yang aman.
// Hanya menerima domain canva.com (keamanan: tolak iframe dari domain lain).
// Contoh masukan yang diterima:
//   https://www.canva.com/design/DAGabc123/XyZ/view?utm_content=...
//   https://www.canva.com/design/DAGabc123/XyZ/edit
// Hasil: https://www.canva.com/design/DAGabc123/XyZ/view?embed
// Apakah ini link Canva yang kita kenal? (design langsung ATAU short link)
export function isCanvaLink(raw?: string): boolean {
  if (!raw) return false;
  try {
    const u = new URL(raw);
    if (/(^|\.)canva\.link$/i.test(u.hostname)) return true;
    return /(^|\.)canva\.com$/i.test(u.hostname) && u.pathname.includes("/design/");
  } catch {
    return false;
  }
}

// Short link canva.link perlu di-resolve server (lihat /api/canva).
export function isCanvaShortLink(raw?: string): boolean {
  if (!raw) return false;
  try {
    return /(^|\.)canva\.link$/i.test(new URL(raw).hostname);
  } catch {
    return false;
  }
}

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
