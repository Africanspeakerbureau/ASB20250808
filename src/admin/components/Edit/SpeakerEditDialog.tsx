import React from "react";
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

// Computed/linked fields we never send back to Airtable
const READ_ONLY_FIELDS = new Set<string>([
  "Full Name",
  "Experience Score",
  "Total Events",
  "Potential Revenue",
  "Created Date",
  "Client Inquiries",
]);

// Attachment placeholders (handled later)
const ATTACHMENT_FIELDS = new Set<string>(["Profile Image", "Header Image"]);

function normalizeMultiline(out: any) {
  if (Array.isArray(out)) return out.filter(Boolean).join("\n");
  return String(out ?? "").replace(/\r\n/g, "\n");
}

function isEqualShallow(a: any, b: any) {
  return JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
}

function buildSpeakerPayload(
  form: Record<string, any>,
  original: { fields?: Record<string, any> } | undefined
) {
  const out: Record<string, any> = {};
  for (const [key, val] of Object.entries(form)) {
    if (READ_ONLY_FIELDS.has(key)) continue;
    if (ATTACHMENT_FIELDS.has(key)) continue;
    const prev = original?.fields?.[key];
    if (!isEqualShallow(val, prev)) out[key] = val;
  }
  return { fields: out };
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
  const [saving, setSaving] = React.useState(false);
  const [tab, setTab] = React.useState<TabKey>("Identity");
  const { record, loading } = useAirtableRecord<any>("Speaker Applications", recordId);
  const buf = React.useRef<Record<string, any>>({});
  const hydratedRef = React.useRef(false);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    if (!record?.id) return;
    if (hydratedRef.current) return;
    buf.current = { ...(record.fields || {}) };
    const f = buf.current;
    buf.current.speakingTopicsText = Array.isArray(f["Speaking Topics"])
      ? f["Speaking Topics"].filter(Boolean).join("\n")
      : String(f["Speaking Topics"] ?? "");
    buf.current.keyMessagesText = Array.isArray(f["Key Messages"])
      ? f["Key Messages"].filter(Boolean).join("\n")
      : String(f["Key Messages"] ?? "");
    hydratedRef.current = true;
    setReady(true);
  }, [record?.id, record]);

  async function handleSave(closeAfter = false) {
    if (!record) return;
    try {
      setSaving(true);
      const data: Record<string, any> = { ...buf.current };
      const { speakingTopicsText, keyMessagesText, ...rest } = data;
      const prepared = {
        ...rest,
        'Speaking Topics': normalizeMultiline(speakingTopicsText ?? rest['Speaking Topics']),
        'Key Messages': normalizeMultiline(keyMessagesText ?? rest['Key Messages']),
      };
      const payload = buildSpeakerPayload(prepared, record);
      if (Object.keys(payload.fields).length === 0) {
        push({ text: "No changes to save", type: "info" });
        if (closeAfter) onClose();
        return;
      }
      await airtablePatchRecord("Speaker Applications", record.id, payload.fields);
      push({ text: "Saved ✔︎", type: "success" });
      if (closeAfter) onClose();
    } catch (e: any) {
      push({ text: e?.message || "Could not save", type: "error" });
      console.error("[Save error]", e);
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
        {ready && (
          <>
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
                  {/* Speaking Topics: full-width, one per line */}
                  <Field label="Speaking Topics (one per line)" full>
                    <textarea
                      className="textarea"
                      rows={10}
                      defaultValue={buf.current.speakingTopicsText ?? ""}
                      onChange={e => (buf.current.speakingTopicsText = e.target.value)}
                      style={{ resize: "vertical" }}
                    />
                  </Field>

                  <TextArea id="keyMessagesText" label="Key Messages" rows={8} full />
                  <TextArea id="Professional Bio" label="Professional Bio" rows={12} full />
                  {/* Key Message: compact 3–4 line box (half width) */}
                  <TextArea id="Key Message" label="Key Message" rows={4} />
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
                  <Badge label="Experience Score" value={buf.current["Experience Score"]} />
                  <Badge label="Total Events" value={buf.current["Total Events (calc)"]} />
                  <Badge label="Potential Revenue" value={buf.current["Potential Revenue"]} />
                  <Upload id="Header Image" label="Header Image" hint="This is the wide banner image" />
                  <TextArea id="Internal Notes" />
                </Grid>
              )}
            </div>
          </>
        )}

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
  function makeId(id: string) {
    return `f-${id.replace(/[^a-zA-Z0-9_-]/g, '-')}`;
  }

  function Text({ id, label }: { id: string; label?: string }) {
    const inputId = makeId(id);
    return (
      <Field id={inputId} label={label ?? id}>
        <input
          id={inputId}
          className="input"
          defaultValue={buf.current[id] ?? ""}
          onChange={e => (buf.current[id] = e.target.value)}
          placeholder={label ?? id}
        />
      </Field>
    );
  }

  function TextArea({ id, label, rows = 4, full = false }: { id: string; label?: string; rows?: number; full?: boolean }) {
    const inputId = makeId(id);
    return (
      <Field id={inputId} label={label ?? id} full={full}>
        <textarea
          id={inputId}
          className="textarea"
          defaultValue={buf.current[id] ?? ""}
          onChange={e => (buf.current[id] = e.target.value)}
          rows={rows}
          style={{ resize: "vertical" }}
        />
      </Field>
    );
  }

  function Select({ id, options, label }: { id: string; options: string[]; label?: string }) {
    const inputId = makeId(id);
    return (
      <Field id={inputId} label={label ?? id}>
        <select
          id={inputId}
          className="select"
          defaultValue={buf.current[id] ?? ""}
          onChange={e => (buf.current[id] = e.target.value)}
        >
          <option value="">— Select —</option>
          {options.map(o => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </Field>
    );
  }

  function Chips({ id, options, allowMulti = true }: { id: string; options: string[]; allowMulti?: boolean }) {
    const [, force] = React.useReducer(x => x + 1, 0);
    const value: string[] = Array.isArray(buf.current[id])
      ? buf.current[id]
      : buf.current[id]
      ? String(buf.current[id]).split(',').map(s => s.trim())
      : [];
    const toggle = (v: string) => {
      if (allowMulti) {
        const next = value.includes(v) ? value.filter(x => x !== v) : [...value, v];
        buf.current[id] = next;
      } else {
        buf.current[id] = value.includes(v) ? '' : v;
      }
      force();
    };
    return (
      <Field label={id}>
        <div className="chips">
          {options.map(v => (
            <button
              type="button"
              key={v}
              className={`chip ${value.includes(v) ? 'chip--on' : ''}`}
              onClick={() => toggle(v)}
            >
              {v}
            </button>
          ))}
        </div>
      </Field>
    );
  }

  function Upload({ id, label, hint }: { id: string; label: string; hint?: string }) {
    const [, force] = React.useReducer(x => x + 1, 0);
    const files = buf.current[id] as any[];
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
          <UploadWidget
            onUpload={uploaded => {
              buf.current[id] = uploaded;
              force();
            }}
          >
            <button className="btn btn--dark">Upload</button>
          </UploadWidget>
        </div>
      </Field>
    );
  }

  function Readonly({ id }: { id: string }) {
    const inputId = makeId(id);
    return (
      <Field id={inputId} label={id}>
        <input id={inputId} className="input" readOnly defaultValue={buf.current[id] ?? ''} />
      </Field>
    );
  }

  function Badge({ label, value }: { label: string; value: any }) {
    return (
      <div className="badge">
        {label}: <strong>{value ?? '—'}</strong>
      </div>
    );
  }
}

// layout atoms
function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid">{children}</div>;
}
function Field({ id, label, hint, children, full = false }: { id?: string; label: string; hint?: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className="field" style={full ? { gridColumn: "1 / -1" } : undefined}>
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      {children}
      {hint && <div className="field__hint">{hint}</div>}
    </div>
  );
}
