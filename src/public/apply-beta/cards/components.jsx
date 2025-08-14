import React from "react";
import UploadWidget from "@/components/UploadWidget";

export function Grid({ children }) {
  return <div className="grid">{children}</div>;
}

export function Field({ label, hint, children }) {
  return (
    <label className="field">
      <div className="field__label">{label}</div>
      {children}
      {hint && <div className="field__hint">{hint}</div>}
    </label>
  );
}

export function Text({ form, setField, id, label }) {
  return (
    <Field label={label ?? id}>
      <input
        className="input"
        value={form[id] ?? ""}
        onChange={e => setField(id, e.target.value)}
        placeholder={label ?? id}
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

export function Chips({ form, setField, id, options, allowMulti = true }) {
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
    <Field label={id}>
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

export function Upload({ form, setField, id, label, hint }) {
  const files = form[id];
  return (
    <Field label={label} hint={hint}>
      <div className="upload-row">
        <div className="upload-preview">
          {Array.isArray(files) && files.length ? (
            files.map((f, i) => <img key={i} src={f.url ?? f} alt="" className="thumb" />)
          ) : (
            <div className="empty">No file selected</div>
          )}
        </div>
        <UploadWidget onUpload={uploaded => setField(id, uploaded)}>
          <button className="btn btn--dark">Upload</button>
        </UploadWidget>
      </div>
    </Field>
  );
}
