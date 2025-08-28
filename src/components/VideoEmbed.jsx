import React from 'react';

function safeURL(raw) {
  try { return new URL(raw); } catch { return null; }
}

export default function VideoEmbed({ url, title = 'Video' }) {
  const u = safeURL(url);
  if (!u) return null;

  const host = u.hostname.replace(/^www\./, '').toLowerCase();
  let embed = null;

  // YouTube: youtube.com / m.youtube.com / youtu.be
  if (host.endsWith('youtube.com')) {
    let id = u.searchParams.get('v');
    if (!id) {
      const m =
        u.pathname.match(/\/embed\/([A-Za-z0-9_-]{11})/) ||
        u.pathname.match(/\/shorts\/([A-Za-z0-9_-]{11})/) ||
        u.pathname.match(/\/watch\/([A-Za-z0-9_-]{11})/);
      if (m) id = m[1];
    }
    if (!id && u.pathname.startsWith('/live/')) id = u.pathname.split('/')[2];
    if (id) embed = `https://www.youtube.com/embed/${id}`;
  } else if (host === 'youtu.be') {
    const id = u.pathname.slice(1).split('/')[0];
    if (id) embed = `https://www.youtube.com/embed/${id}`;
  }

  // Vimeo
  if (!embed && host.endsWith('vimeo.com')) {
    const seg = u.pathname.split('/').filter(Boolean);
    const id = seg.pop();
    if (id && /^\d+$/.test(id)) embed = `https://player.vimeo.com/video/${id}`;
  }

  // TED: https://www.ted.com/talks/<slug>
  if (!embed && host.endsWith('ted.com') && u.pathname.startsWith('/talks/')) {
    const slug = u.pathname.replace(/^\/talks\//, '').replace(/\/+$/, '');
    if (slug) embed = `https://embed.ted.com/talks/${slug}`;
  }

  if (embed) {
    return (
      <iframe
        className="w-full aspect-video rounded-2xl border bg-black"
        src={embed}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    );
  }

  // Fallback for sites that forbid iframes
  return (
    <a
      href={u.href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-between w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm hover:bg-gray-50"
      aria-label={`Open on ${host}`}
    >
      <div className="min-w-0">
        <div className="text-sm font-semibold text-gray-900">Open on {host}</div>
        <div className="text-xs text-gray-500 truncate">{u.pathname || u.href}</div>
      </div>
      <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M13 7h-2a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V9.414l-7.293 7.293a1 1 0 01-1.414-1.414L13 7.414V7z"/>
      </svg>
    </a>
  );
}
