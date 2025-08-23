import React from 'react';

export default function SpeakingTopics({ topics }) {
  if (!topics || !topics.length) return null;
  return (
    <section className="card">
      <h2 className="card-title">Speaking Topics</h2>
      <ul className="bullet-list">
        {topics.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </section>
  );
}
