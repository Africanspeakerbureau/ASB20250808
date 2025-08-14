import React from "react";

export function Grid({ children }) {
  return <div className="grid">{children}</div>;
}

export function Field({ label, hint, children, required }) {
  return (
    <label className="field">
      <div className="field__label">
        {label}
        {required && <span className="text-red-500">*</span>}
      </div>
      {children}
      {hint && <div className="field__hint">{hint}</div>}
    </label>
  );
}

export function Text({ form, setField, id, label, required, type = "text", inputMode }) {
  return (
    <Field label={label ?? id} required={required}>
      <input
        className="input"
        value={form[id] ?? ""}
        onChange={e => setField(id, e.target.value)}
        placeholder={label ?? id}
        required={required}
        type={type}
        inputMode={inputMode}
      />
    </Field>
  );
}

export function TextArea({ form, setField, id, label }) {
  return (
    <Field label={label ?? id}>
      <textarea
        className="textarea"
        value={form[id] ?? ""}
        onChange={e => setField(id, e.target.value)}
        rows={4}
      />
    </Field>
  );
}

export function Select({ form, setField, id, options, label }) {
  return (
    <Field label={label ?? id}>
      <select
        className="select"
        value={form[id] ?? ""}
        onChange={e => setField(id, e.target.value)}
      >
        <option value="">— Select —</option>
        {options.map(o => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </Field>
  );
}

export function Chips({ form, setField, id, options, allowMulti = true, label }) {
  const value = Array.isArray(form[id])
    ? form[id]
    : form[id]
    ? String(form[id]).split(",").map(s => s.trim())
    : [];
  const toggle = v => {
    if (allowMulti) {
      const next = value.includes(v) ? value.filter(x => x !== v) : [...value, v];
      setField(id, next);
    } else {
      setField(id, value.includes(v) ? "" : v);
    }
  };
  return (
    <Field label={label ?? id}>
      <div className="chips">
        {options.map(v => (
          <button
            type="button"
            key={v}
            className={`chip ${value.includes(v) ? "chip--on" : ""}`}
            onClick={() => toggle(v)}
          >
            {v}
          </button>
        ))}
      </div>
    </Field>
  );
}
