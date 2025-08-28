import React from 'react';
import { getEmbedInfo } from '@/lib/video';

export default function VideoEmbed({ url }: { url: string }) {
  const info = getEmbedInfo(url);
  const common = {
    className: 'w-full aspect-video rounded-2xl border border-gray-200 overflow-hidden',
    loading: 'lazy' as const,
    referrerPolicy: 'strict-origin-when-cross-origin' as const,
    allowFullScreen: true,
  };

  if (info.kind === 'youtube' || info.kind === 'vimeo' || info.kind === 'ted') {
    return (
      <iframe
        {...common}
        src={info.embedUrl}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        title="Video"
      />
    );
  }

  // External fallback card (no long URL)
  return (
    <a
      href={info.href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between w-full rounded-2xl border border-gray-200 px-4 py-3 hover:bg-gray-50 transition"
      aria-label={`Open on ${info.host}`}
    >
      <div className="min-w-0">
        <div className="text-sm font-semibold text-gray-900">Open on {info.host}</div>
        <div className="text-xs text-gray-500 truncate">{new URL(info.href).pathname}</div>
      </div>
      <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path d="M13 7h-2a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V9.414l-7.293 7.293a1 1 0 01-1.414-1.414L13 7.414V7z"/></svg>
    </a>
  );
}

