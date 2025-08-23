import React from "react";
import DOMPurify from "dompurify";

const Rich = ({ html }) =>
  html ? (
    <div
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html).replace(/\n/g, "<br/>") }}
    />
  ) : null;

export default function SpeakerTrackRecord({ s }) {
  if (!s?.notableAchievements && !s?.achievements && !s?.education) return null;

  return (
    <section aria-labelledby="track-record" className="card p-6 space-y-6">
      <h2 id="track-record" className="text-2xl font-bold">Track Record</h2>

      {s.notableAchievements && (
        <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
          <h3 className="text-lg font-semibold mb-1">Notable Achievements</h3>
          <p className="m-0">{s.notableAchievements}</p>
        </div>
      )}

      {s.achievements && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Other Achievements</h3>
          <Rich html={s.achievements} />
        </div>
      )}

      {s.education && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Education</h3>
          <Rich html={s.education} />
        </div>
      )}
    </section>
  );
}

