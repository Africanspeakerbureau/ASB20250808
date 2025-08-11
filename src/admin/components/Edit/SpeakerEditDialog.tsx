import React, { useEffect, useState, useCallback } from "react";
import ReactDOM from "react-dom";
import {
  INDUSTRIES, YEARS_EXPERIENCE, SPEAKING_EXPERIENCE, NUMBER_OF_EVENTS, LARGEST_AUDIENCE,
  VIRTUAL_EXPERIENCE, EXPERTISE_AREAS, SPOKEN_LANGUAGES, COUNTRIES, FEE_RANGE,
  TRAVEL_WILLINGNESS, FEATURED, STATUS, EXPERTISE_LEVEL, DISPLAY_FEE
} from "../../edit/options";
import UploadWidget from "@/components/UploadWidget";
import { useToast } from "@/components/Toast";
import { useAirtableRecord } from "../../hooks/useAirtableRecord";
import { airtablePatchRecord } from "../../api/airtable";
import "./editDialog.css";

// Read-only and unsupported fields we don't send back
const READ_ONLY_FIELDS = new Set<string>([
  "Experience Score",
  "Total Events",
  "Total Events (calc)",
  "Potential Revenue",
  "Created Date",
  "Full Name",
  "Days Until Event",
  "Total Inquiries",
  "Response Time",
  "Speaker Status",
]);

const ATTACHMENT_FIELDS = new Set<string>(["Profile Image", "Header Image"]);
const LINKED_RECORD_FIELDS = new Set<string>(["Client Inquiries"]);

const MULTI_SELECT_FIELDS = new Set<string>([
  "Expertise Areas",
  "Spoken Languages",
  "Status",
]);

const SINGLE_SELECT_FIELDS = new Set<string>([
  "Industry",
  "Years Experience",
  "Expertise Level",
  "Speaking Experience",
  "Number of Events",
  "Largest Audience",
  "Virtual Experience",
  "Fee Range",
  "Travel Willingness",
  "Country",
  "Featured",
  "Display Fee",
]);

function buildSpeakerPayload(form: Record<string, any>) {
  const out: Record<string, any> = {};
  for (const [key, raw] of Object.entries(form)) {
    if (
      READ_ONLY_FIELDS.has(key) ||
      ATTACHMENT_FIELDS.has(key) ||
      LINKED_RECORD_FIELDS.has(key)
    ) {
      continue;
    }
    if (raw === "" || raw === undefined || raw === null) continue;
    if (MULTI_SELECT_FIELDS.has(key)) {
      out[key] = Array.isArray(raw)
        ? raw.map(String)
        : String(raw)
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
      continue;
    }
    if (SINGLE_SELECT_FIELDS.has(key)) {
      out[key] = String(raw);
      continue;
    }
    out[key] = raw;
  }
  return out;
}

type Props = {
  recordId: string;
  onClose: () => void;
};

const isAdmin = true; // from your session
const ALL_TABS = [
  "Identity",
  "Background",
  "Experience",
  "Expertise & Content",
  "Why booking",
  "Media & Languages",
  "Logistics & Fees",
  "Contact & Admin",
  "Internal",
] as const;
type TabKey = typeof ALL_TABS[number];
const TABS: TabKey[] = isAdmin ? [...ALL_TABS] : ALL_TABS.filter(t => t !== "Internal");

export default function SpeakerEditDialog({ recordId, onClose }: Props) {
const { push } = useToast();
const [saving, setSaving] = useState(false);
const [tab, setTab] = useState<TabKey>("Identity");
const { record, loading } = useAirtableRecord<any>('Speaker Applications', recordId);
  const [form, setForm] = useState<Record<string, any>>({});
  useEffect(() => {
    if (record) {
      setForm({ ...(record.fields || {}) });
    }
  }, [record?.id]);

  const setField = useCallback((name: string, value: any) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  async function handleSave(closeAfter = true) {
    if (!record) return;
    try {
      setSaving(true);
      const fields = buildSpeakerPayload(form);
      if (!Object.keys(fields).length) {
        push({ text: 'Nothing to save.', type: 'info' });
        setSaving(false);
        if (closeAfter) onClose();
        return;
      }
      await airtablePatchRecord('Speaker Applications', record.id, fields);
      push({ text: 'Saved ✔︎', type: 'success' });
      if (closeAfter) onClose();
    } catch (e: any) {
      push({ text: e?.message || 'Could not save', type: 'error' });
      console.error('[Save error]', e);
    } finally {
      setSaving(false);
    }
  }

  if (!record && !loading) return null;

  return ReactDOM.createPortal(
    <div className="modal">
      <div className="modal__panel" role="dialog" aria-modal="true">
        <div className="modal__header">
          <h2>Edit</h2>
          <button className="icon-btn" aria-label="Close" onClick={onClose}>✕</button>
        </div>
        {loading && <div className="loading-bar">Loading record…</div>}
        <div className="tabs">
          {TABS.map(t => (
            <button
              key={t}
              className={`tab ${tab === t ? "tab--active" : ""}`}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="modal__body">
          {tab === "Identity" && (
            <Grid>
              <Text id="First Name" />
              <Text id="Last Name" />
              <Text id="Title" label="Title (Dr/Prof)" />
              <Text id="Professional Title" />
              <Text id="Company" label="Company/Organization" />
              <Text id="Location" />
              <Select id="Country" options={COUNTRIES} />
              <Upload id="Profile Image" label="Profile Image" hint="JPG/PNG, max 5MB" />
            </Grid>
          )}

          {tab === "Background" && (
            <Grid>
              <Select id="Industry" options={INDUSTRIES} />
              <Select id="Expertise Level" options={EXPERTISE_LEVEL} />
              <Select id="Years Experience" options={YEARS_EXPERIENCE} />
              <TextArea id="Notable Achievements" />
              <TextArea id="Achievements" />
              <TextArea id="Education" />
            </Grid>
          )}

          {tab === "Experience" && (
            <Grid>
              <Select id="Speaking Experience" options={SPEAKING_EXPERIENCE} />
              <Select id="Number of Events" options={NUMBER_OF_EVENTS} />
              <Select id="Largest Audience" options={LARGEST_AUDIENCE} />
              <Select id="Virtual Experience" options={VIRTUAL_EXPERIENCE} />
            </Grid>
          )}

          {tab === "Expertise & Content" && (
            <Grid>
              <Chips id="Expertise Areas" options={EXPERTISE_AREAS} />
              <TextArea id="Speaking Topics" />
              <TextArea id="Key Messages" />
              <TextArea id="Professional Bio" />
            </Grid>
          )}

          {tab === "Why booking" && (
            <Grid>
              <TextArea id="Speakers Delivery Style" label="Speaker’s Delivery Style" />
              <TextArea id="Why the audience should listen to these topics" />
              <TextArea id="What the speeches will address" />
              <TextArea id="What participants will learn" />
              <TextArea id="What the audience will take home" />
              <TextArea id="Benefits for the individual" />
              <TextArea id="Benefits for the organisation" />
            </Grid>
          )}

          {tab === "Media & Languages" && (
            <Grid>
              <Upload id="Header Image" label="Header Image" hint="Wide aspect recommended; JPG/PNG" />
              <Text id="Video Link 1" />
              <Text id="Video Link 2" />
              <Text id="Video Link 3" />
              <Chips id="Spoken Languages" options={SPOKEN_LANGUAGES} />
            </Grid>
          )}

          {tab === "Logistics & Fees" && (
            <Grid>
              <Select id="Fee Range" options={FEE_RANGE} label="Fee Range (USD)" />
              <Select id="Display Fee" options={DISPLAY_FEE} label="Display Fee on site?" />
              <Select id="Travel Willingness" options={TRAVEL_WILLINGNESS} />
              <TextArea id="Travel Requirements" />
            </Grid>
          )}

          {tab === "Contact & Admin" && (
            <Grid>
              <Text id="Website" />
              <Text id="LinkedIn" label="LinkedIn Profile" />
              <Text id="Twitter" label="Twitter/X Profile" />
              <TextArea id="References" />
              <Text id="PA Name" />
              <Text id="PA Email" />
              <Text id="PA Phone" />
              <TextArea id="Banking Details" />
              <TextArea id="Special Requirements" />
              <TextArea id="Additional Info" />
            </Grid>
          )}

          {tab === "Internal" && (
            <Grid>
              <Chips id="Status" options={STATUS} allowMulti />
              <Select id="Featured" options={FEATURED} />
              <Readonly id="Created Date" />
              <Readonly id="Client Inquiries" />
              <Badge label="Experience Score" value={form["Experience Score"]} />
              <Badge label="Total Events" value={form["Total Events (calc)"]} />
              <Badge label="Potential Revenue" value={form["Potential Revenue"]} />
              <Upload id="Header Image" label="Header Image" hint="This is the wide banner image" />
              <TextArea id="Internal Notes" />
            </Grid>
          )}
        </div>

        <div className="modal__footer">
          <button className="btn" disabled={saving} onClick={onClose}>Close</button>
          <button className="btn" disabled={saving} onClick={() => handleSave(false)}>
            {saving ? "Saving…" : "Save"}
          </button>
          <button className="btn btn--primary" disabled={saving} onClick={() => handleSave(true)}>
            {saving ? "Saving…" : "Save & Close"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );

  // ————— helpers —————
  function Text({ id, label }: { id: string; label?: string }) {
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
  function TextArea({ id, label }: { id: string; label?: string }) {
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
  function Select({ id, options, label }: { id: string; options: string[]; label?: string }) {
    return (
      <Field label={label ?? id}>
        <select
          className="select"
          value={form[id] ?? ""}
          onChange={e => setField(id, e.target.value)}
        >
          <option value="">— Select —</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </Field>
    );
  }
  function Chips({ id, options, allowMulti = true }: { id: string; options: string[]; allowMulti?: boolean }) {
    const value: string[] = Array.isArray(form[id]) ? form[id] : (form[id] ? String(form[id]).split(",").map(s => s.trim()) : []);
    const toggle = (v: string) => {
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
            <button type="button" key={v} className={`chip ${value.includes(v) ? "chip--on" : ""}`} onClick={() => toggle(v)}>
              {v}
            </button>
          ))}
        </div>
      </Field>
    );
  }
  function Upload({ id, label, hint }: { id: string; label: string; hint?: string }) {
    const files = form[id] as any[];
    return (
      <Field label={label} hint={hint}>
        <div className="upload-row">
          <div className="upload-preview">
            {Array.isArray(files) && files.length ? files.map((f, i) => (
              <img key={i} src={f.url ?? f} alt="" className="thumb" />
            )) : <div className="empty">No file selected</div>}
          </div>
          <UploadWidget
            onUpload={(uploaded) => {
              setField(id, uploaded);
            }}
          >
            <button className="btn btn--dark">Upload</button>
          </UploadWidget>
        </div>
      </Field>
    );
  }
  function Readonly({ id }: { id: string }) {
    return (
      <Field label={id}>
        <input className="input" readOnly value={form[id] ?? ""} />
      </Field>
    );
  }
  function Badge({ label, value }: { label: string; value: any }) {
    return <div className="badge">{label}: <strong>{value ?? "—"}</strong></div>;
  }
}

// layout atoms
function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid">{children}</div>;
}
function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="field">
      <div className="field__label">{label}</div>
      {children}
      {hint && <div className="field__hint">{hint}</div>}
    </label>
  );
}
