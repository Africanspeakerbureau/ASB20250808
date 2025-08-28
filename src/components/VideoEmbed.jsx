import { useMemo, useState } from "react";

/** Convert many common share URLs into real embed URLs. */
function toEmbedUrl(raw) {
  try {
    const u = new URL(String(raw).trim());
    const host = u.hostname.replace(/^www\./, "");

    // ---- YouTube ----
    if (host.endsWith("youtube.com")) {
      // /watch?v=ID  |  /shorts/ID  |  /embed/ID
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
      const parts = u.pathname.split("/").filter(Boolean);
      if (parts[0] === "shorts" && parts[1]) return `https://www.youtube.com/embed/${parts[1]}`;
      if (parts[0] === "embed" && parts[1]) return u.toString();
    }
    if (host === "youtu.be") {
      const id = u.pathname.replace("/", "");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }

    // ---- Vimeo ----
    if (host === "vimeo.com") {
      const id = (u.pathname.match(/\/(\d+)/) || [])[1];
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
    if (host === "player.vimeo.com") return u.toString();

    // ---- TED ----
    if (host.endsWith("ted.com")) {
      // Accept /talks/<slug> or already-embedded
      if (host === "embed.ted.com") return u.toString();
      const slug = u.pathname.replace(/^\/talks\//, "").split(/[?#]/)[0];
      if (slug) return `https://embed.ted.com/talks/${slug}`;
    }

    // ---- Direct MP4 (hosted file) ----
    if (u.pathname.toLowerCase().endsWith(".mp4")) return u.toString();

    return null;
  } catch {
    return null;
  }
}

export default function VideoEmbed({ url, title = "Video" }) {
  const [broken, setBroken] = useState(false);
  const embedUrl = useMemo(() => toEmbedUrl(url), [url]);

  // Fallback for providers that refuse iframes (LinkedIn, FB, X, etc.)
  if (!embedUrl || broken) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-2xl border bg-white p-4 shadow-sm hover:shadow-md transition"
        aria-label="Open video in a new tab"
      >
        <div className="text-sm text-gray-600">Open video</div>
        <div className="truncate font-medium">{url}</div>
      </a>
    );
  }

  // Direct files
  if (embedUrl.endsWith(".mp4")) {
    return (
      <video
        controls
        className="w-full rounded-2xl bg-black"
        src={embedUrl}
        onError={() => setBroken(true)}
      />
    );
  }

  // Standard iframe
  return (
    <div className="aspect-video w-full overflow-hidden rounded-2xl bg-gray-100">
      <iframe
        title={title}
        src={embedUrl}
        className="h-full w-full"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        onError={() => setBroken(true)}
      />
    </div>
  );
}

