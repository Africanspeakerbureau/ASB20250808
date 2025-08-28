import React from "react";
import { ExternalLink } from "lucide-react";

/**
 * Domains that allow embedding (and how to build embed URLs)
 */
function isYouTube(u) {
  const h = u.hostname.replace(/^www\./, "");
  return h.endsWith("youtube.com") || h.endsWith("youtu.be");
}
function youTubeEmbed(u) {
  // watch?v=VIDEO or youtu.be/VIDEO
  const id =
    u.searchParams.get("v") ||
    u.pathname.split("/").filter(Boolean).pop();
  return id ? `https://www.youtube.com/embed/${id}` : null;
}

function isVimeo(u) {
  const h = u.hostname.replace(/^www\./, "");
  return h.endsWith("vimeo.com");
}
function vimeoEmbed(u) {
  const id = u.pathname.split("/").filter(Boolean)[0];
  return id ? `https://player.vimeo.com/video/${id}` : null;
}

/**
 * Sites that routinely set X-Frame-Options or CSP to block iframes.
 * For these we skip <iframe> entirely and show a nice external card.
 */
const NEVER_EMBED_HOSTS = [
  "ted.com",
  "linkedin.com",
  "x.com",
  "twitter.com",
  "facebook.com",
  "instagram.com",
  "constellationr.com",
  "constellationr.events",
  "constellationresearch.com",
];

function parse(url) {
  try {
    return new URL(url);
  } catch {
    return null;
  }
}

function canEmbed(u) {
  if (!u) return false;
  const host = u.hostname.replace(/^www\./, "");
  if (NEVER_EMBED_HOSTS.includes(host)) return false;
  if (isYouTube(u) || isVimeo(u)) return true;
  return false;
}

function toEmbedUrl(u) {
  if (isYouTube(u)) return youTubeEmbed(u);
  if (isVimeo(u)) return vimeoEmbed(u);
  return null;
}

function domainLabel(host) {
  if (host.includes("youtube")) return "Open on YouTube";
  if (host.includes("vimeo")) return "Open on Vimeo";
  if (host.includes("ted")) return "Open on TED";
  if (host.includes("linkedin")) return "Open on LinkedIn";
  if (host.includes("twitter") || host.includes("x.")) return "Open on X";
  if (host.includes("facebook")) return "Open on Facebook";
  if (host.includes("instagram")) return "Open on Instagram";
  if (host.includes("constellation")) return "Open on Constellation";
  return "Open video";
}

export default function VideoEmbed({ url, title }) {
  const u = parse(url);

  // Embeddable → render iframe
  if (u && canEmbed(u)) {
    const src = toEmbedUrl(u);
    if (src) {
      return (
        <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black/5">
          <iframe
            src={src}
            title={title || "Video"}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="h-full w-full border-0"
          />
        </div>
      );
    }
  }

  // Nice external-link card (no raw long URL)
  const host = u ? u.hostname.replace(/^www\./, "") : "external site";
  const label = domainLabel(host);
  const prettyPath =
    u && u.pathname !== "/"
      ? u.pathname.replace(/^\/+/, "")
      : "";

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-2xl border bg-white p-4 hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-blue-500"    >
      <div className="flex items-center justify-between">
        <div className="text-[0.9rem] font-medium text-gray-900">
          {label}
        </div>
        <ExternalLink className="h-4 w-4 text-gray-500" />
      </div>
      <div className="mt-1 text-sm text-gray-600">
        <span className="font-medium">{host}</span>
        {prettyPath ? <span className="truncate block">{`/${prettyPath}`}</span> : null}
      </div>
    </a>
  );
}

