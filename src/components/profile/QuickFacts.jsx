import React from 'react';

export default function QuickFacts({ country, languages, availability, feeRange }) {
  return (
    <section className="card">
      <h2 className="card-title">Quick facts</h2>
      <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
        <dt className="text-gray-500">Country</dt>
        <dd>{country || '—'}</dd>
        <dt className="text-gray-500">Languages</dt>
        <dd>{languages?.join(', ') || '—'}</dd>
        <dt className="text-gray-500">Availability</dt>
        <dd>{availability || '—'}</dd>
        <dt className="text-gray-500">Fee range</dt>
        <dd>{feeRange || 'On request'}</dd>
      </dl>
    </section>
  );
}
