import React from 'react';

export default function KeyMessages({ text }) {
  if (!text) return null;
  return (
    <section className="card">
      <h2 className="card-title">Key Messages</h2>
      <p className="whitespace-pre-line">{text}</p>
    </section>
  );
}
