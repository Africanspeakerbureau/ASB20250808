import React from "react";

function Fact({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-4 text-[15px]">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-800">{value}</span>
    </div>
  );
}

function Chips({ title, items }) {
  if (!items || !items.length) return null;
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
      <h4 className="text-base font-semibold mb-3">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {items.map((x) => (
          <span
            key={x}
            className="rounded-full border border-slate-200 px-3 py-1 text-[13px] bg-slate-50"
          >
            {x}
          </span>
        ))}
      </div>
    </section>
  );
}

export default function SidebarInfo({ speaker }) {
  if (!speaker) return null;
  const { country, languagesChips, availability, feeRange, expertiseAreas } = speaker;

  return (
    <aside className="space-y-4 md:space-y-5">
      {/* Add mobile gap below back button; md:mt-0 keeps desktop tidy */}
      <section className="mt-4 md:mt-0 rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
        <h3 className="text-lg font-bold mb-3">Quick facts</h3>
        <div className="space-y-2">
          <Fact label="Country" value={country} />
          <Fact
            label="Languages"
            value={languagesChips && languagesChips.length ? languagesChips.join(" · ") : null}
          />
          <Fact label="Availability" value={availability} />
          <Fact label="Fee range" value={feeRange} />
        </div>
      </section>

      <Chips title="Expertise areas" items={expertiseAreas} />
      <Chips title="Languages" items={languagesChips} />
    </aside>
  );
}

