import { useMemo } from "react";
export default function MultiSelect({ label, values=[], options=[], onChange }) {
  const set = useMemo(()=>new Set(values||[]),[values]);
  const toggle = (opt) => {
    const next = new Set(set);
    if (next.has(opt)) next.delete(opt); else next.add(opt);
    onChange(Array.from(next));
  };
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt)=>(
          <button
            key={opt}
            type="button"
            onClick={()=>toggle(opt)}
            className={`px-3 py-1 rounded-full border text-sm ${set.has(opt)?'bg-neutral-900 text-white border-neutral-900':'bg-white hover:bg-neutral-50 border-neutral-300'}`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
