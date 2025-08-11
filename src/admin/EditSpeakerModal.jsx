import { useEffect, useState } from "react";
import { SPEAKER_FIELDS, SPEAKER_TABS } from "./speakerFieldMap";
import { getSpeakerById, updateSpeaker } from "../lib/airtable";
import { toast } from "../lib/toast";
import "./admin-edit.css";

export default function EditSpeakerModal({ recordId, open, onClose }) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState({});           // raw Airtable fields
  const [form, setForm] = useState({});           // UI state
  const [dirty, setDirty] = useState(false);
  const [tab, setTab] = useState(SPEAKER_TABS[0]);

  // load
  useEffect(() => {
    if (!open || !recordId) return;
    setLoading(true);
    getSpeakerById(recordId)
      .then(rec => {
        const fields = rec?.fields || {};
        setData(fields);
        setForm(deserialize(fields));
        setDirty(false);
      })
      .finally(() => setLoading(false));
  }, [open, recordId]);

  // serialize / deserialize helpers
  function deserialize(fields) {
    const f = {};
    SPEAKER_FIELDS.forEach(def => {
      const v = fields[def.key];
      if (def.kind === "multi")       f[def.key] = Array.isArray(v) ? v : (v ? [v].filter(Boolean) : []);
      else if (def.kind === "single") f[def.key] = typeof v === "string" ? v : (Array.isArray(v) ? v[0] : v ?? "");
      else if (def.kind === "attachments") f[def.key] = Array.isArray(v) ? v.map(a => a.url) : [];
      else                              f[def.key] = v ?? "";
    });
    return f;
  }

  function serialize(formState) {
    const out = {};
    SPEAKER_FIELDS.forEach(def => {
      if (def.readonly) return;
      const v = formState[def.key];
      if (def.kind === "multi") out[def.key] = Array.isArray(v) ? v : [];
      else if (def.kind === "attachments") {
        // minimal support: send URLs (Airtable will fetch and attach)
        out[def.key] = (v || []).filter(Boolean).map(url => ({ url }));
      } else out[def.key] = v ?? null;
    });
    return out;
  }

  // change handler
  function setValue(key, value) {
    setForm(prev => ({ ...prev, [key]: value }));
    setDirty(true);
  }

  async function onSave(closeAfter=false) {
    try {
      setSaving(true);
      // diff only changed keys
      const payload = {};
      for (const def of SPEAKER_FIELDS) {
        if (def.readonly) continue;
        const before = data[def.key];
        const after  = form[def.key];
        const changed = JSON.stringify(deserialize({[def.key]: before})[def.key]) !== JSON.stringify(after);
        if (changed) payload[def.key] = serialize({[def.key]: after})[def.key];
      }
      if (Object.keys(payload).length === 0) {
        toast("No changes to save");
        return;
      }
      await updateSpeaker(recordId, payload);
      toast("Saved");
      setDirty(false);
      if (closeAfter) onClose?.();
    } catch (e) {
      console.error(e);
      toast("Save failed");
    } finally {
      setSaving(false);
    }
  }

  // UI field renderer (kept compact)
  function Field({ def }) {
    const val = form[def.key] ?? "";
    if (def.kind === "textarea") return (
      <label className="f">
        <span>{def.label}</span>
        <textarea value={val} onChange={e=>setValue(def.key, e.target.value)} rows={5}/>
      </label>
    );
    if (def.kind === "multi") return (
      <label className="f">
        <span>{def.label}</span>
        <input
          value={(val||[]).join(", ")}
          placeholder="Comma-separated"
          onChange={e=>setValue(def.key, e.target.value.split(",").map(s=>s.trim()).filter(Boolean))}
        />
        <small>Separate values with commas</small>
      </label>
    );
    if (def.kind === "attachments") return (
      <label className="f">
        <span>{def.label}</span>
        <input
          value={(val||[]).join(", ")}
          placeholder="Paste one or more image URLs, comma-separated"
          onChange={e=>setValue(def.key, e.target.value.split(",").map(s=>s.trim()).filter(Boolean))}
        />
      </label>
    );
    return (
      <label className="f">
        <span>{def.label}</span>
        <input
          type={def.kind==="email"?"email":def.kind==="url"?"url":def.kind==="phone"?"tel":"text"}
          value={val || ""}
          onChange={e=>setValue(def.key, e.target.value)}
        />
      </label>
    );
  }

  if (!open) return null;

  return (
    <div role="dialog" aria-modal="true" className="modal">
      <div className="panel">
        <div className="panel__title">Edit</div>
        <nav className="tabs">
          {SPEAKER_TABS.map(t=> (
            <button key={t} className={t===tab?"active":""} onClick={()=>setTab(t)}>{t}</button>
          ))}
        </nav>

        {loading ? <div className="loading">Loading…</div> : (
          <div className="grid">
            {SPEAKER_FIELDS.filter(f=>f.tab===tab).map(def=>(
              <Field key={def.key} def={def}/>
            ))}
          </div>
        )}

        <div className="actions">
          <button onClick={onClose} disabled={saving}>Cancel</button>
          <button onClick={()=>onSave(false)} disabled={saving || !dirty}>
            {saving ? "Saving…" : "Save"}
          </button>
          <button className="primary" onClick={()=>onSave(true)} disabled={saving || !dirty}>
            {saving ? "Saving…" : "Save & Close"}
          </button>
        </div>
      </div>
      <div className="backdrop" onClick={onClose}/>
    </div>
  );
}
