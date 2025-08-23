import React from 'react';
import VideoEmbed from '../VideoEmbed';

export default function Videos({ videos = [], speakerName = '' }) {
  if (!videos.length) return null;
  return (
    <section className="card">
      <h2 className="card-title">Videos</h2>
      <div className="video-grid">
        {videos.map((url, i) => (
          <VideoEmbed key={i} url={url} title={`Video ${i + 1} — ${speakerName}`} />
        ))}
      </div>
    </section>
  );
}
