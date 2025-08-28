export type EmbedInfo =
  | { kind: 'youtube' | 'vimeo' | 'ted'; embedUrl: string }
  | { kind: 'external'; href: string; host: string };

const YT_ID_RE = /(?:v=|\/)([0-9A-Za-z_-]{11})(?:[?&].*)?$/;

export function getEmbedInfo(raw: string): EmbedInfo {
  if (!raw) return { kind: 'external', href: '', host: '' };
  const url = new URL(raw);

  // --- YouTube (www, m., youtu.be) ---
  if (/(^|\.)youtube\.com$/.test(url.hostname) || url.hostname === 'm.youtube.com') {
    const v = url.searchParams.get('v');
    const id = v ?? (YT_ID_RE.exec(url.pathname)?.[1] ?? '');
    if (id) return { kind: 'youtube', embedUrl: `https://www.youtube.com/embed/${id}` };
  }
  if (url.hostname === 'youtu.be') {
    const id = (YT_ID_RE.exec(url.pathname)?.[1] ?? url.pathname.replace('/', ''));
    if (id) return { kind: 'youtube', embedUrl: `https://www.youtube.com/embed/${id}` };
  }

  // --- Vimeo ---
  if (/(^|\.)vimeo\.com$/.test(url.hostname)) {
    const seg = url.pathname.split('/').filter(Boolean);
    const id = seg.pop();
    if (id && /^\d+$/.test(id)) return { kind: 'vimeo', embedUrl: `https://player.vimeo.com/video/${id}` };
  }

  // --- TED: https://www.ted.com/talks/<slug>[?...]
  if (/(^|\.)ted\.com$/.test(url.hostname) && url.pathname.startsWith('/talks/')) {
    const slug = url.pathname.split('/').filter(Boolean).slice(1).join('/');
    if (slug) return { kind: 'ted', embedUrl: `https://embed.ted.com/talks/${slug}` };
  }

  // Fallback
  return { kind: 'external', href: url.href, host: url.host.replace(/^www\./, '') };
}

