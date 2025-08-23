import React from "react";

function Block({ title, text }) {
  if (!text) return null;
  return (
    <div className="space-y-1">
      <h4 className="text-base font-semibold">{title}</h4>
      <div className="text-[15px] leading-relaxed whitespace-pre-line text-slate-700">
        {text}
      </div>
    </div>
  );
}

export default function TrackRecordCard({ speaker }) {
  if (!speaker) return null;

  const { notableAchievements, achievements, education } = speaker;
  const hasAny = notableAchievements || achievements || education;
  if (!hasAny) return null;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
      <h3 className="text-xl md:text-2xl font-bold mb-4">Track Record</h3>
      <div className="space-y-5">
        <Block title="Notable Achievements" text={notableAchievements} />
        <Block title="Other Achievements" text={achievements} />
        <Block title="Education" text={education} />
      </div>
    </section>
  );
}

