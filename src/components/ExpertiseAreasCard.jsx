import React from "react";

export default function ExpertiseAreasCard({ items = [] }) {
  if (!items.length) return null;
  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold mb-3">Expertise areas</h2>
      <div className="flex flex-wrap gap-2">
        {items.map((x, i) => (
          <span
            key={i}
            className="inline-flex items-center rounded-full border px-2.5 py-1 text-sm text-gray-700 bg-white shadow-sm"
          >
            {x}
          </span>
        ))}
      </div>
    </section>
  );
}

