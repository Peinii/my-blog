// Ubah link CodePen apa pun menjadi URL embed yang aman.
// Terima: https://codepen.io/user/pen/HASH  (juga /full/, /details/)
// Hasil : https://codepen.io/user/embed/HASH?default-tab=result
export function codepenEmbedUrl(raw?: string): string | null {
  if (!raw) return null;
  try {
    const u = new URL(raw);
    if (!/(^|\.)codepen\.io$/i.test(u.hostname)) return null;
    const m = u.pathname.match(
      /^\/([\w-]+)\/(?:pen|full|details|embed)\/([\w-]+)/i
    );
    if (!m) return null;
    const [, user, hash] = m;
    return `https://codepen.io/${user}/embed/${hash}?default-tab=result&editable=true`;
  } catch {
    return null;
  }
}
