import React from 'react';

export default function InfoCard({ title, subtitle, children }) {
  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm info-card">
      <header className="info-card__head">
        <h3 className="info-card__title">{title}</h3>
        {subtitle && <p className="info-card__subtitle">{subtitle}</p>}
      </header>
      <div className="info-card__body">{children}</div>
    </section>
  );
}
