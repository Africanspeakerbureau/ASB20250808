import React from "react";

export default function SpeakingTopics({ topics = [] }) {
  if (!topics.length) return null;
  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold mb-3">Speaking Topics</h3>
      <ul className="list-disc ml-6 space-y-2">
        {topics.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </section>
  );
}
