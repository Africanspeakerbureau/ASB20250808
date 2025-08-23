import React from 'react';

export default function ExpertiseAreas({ areas }) {
  if (!areas || !areas.length) return null;
  return (
    <section className="card">
      <h2 className="card-title">Expertise areas</h2>
      <div className="flex flex-wrap gap-2 mt-2">
        {areas.map(tag => (
          <span key={tag} className="inline-block rounded-full px-3 py-1 text-sm border">
            {tag}
          </span>
        ))}
      </div>
    </section>
  );
}
