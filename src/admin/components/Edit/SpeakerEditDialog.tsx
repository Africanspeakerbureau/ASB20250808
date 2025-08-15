import React from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  INDUSTRIES, YEARS_EXPERIENCE, SPEAKING_EXPERIENCE, NUMBER_OF_EVENTS, LARGEST_AUDIENCE,
  VIRTUAL_EXPERIENCE, EXPERTISE_AREAS, SPOKEN_LANGUAGES, COUNTRIES, FEE_RANGE,
  TRAVEL_WILLINGNESS, FEATURED, STATUS, EXPERTISE_LEVEL, DISPLAY_FEE
} from "../../edit/options";
import UploadWidget from "@/components/UploadWidget";
import { useToast } from "@/components/Toast";
import { airtablePatchRecord, getRecord } from "../../api/airtable";
import "./editDialog.css";

function useFormBuffer<T extends Record<string, any>>(initial: T) {
  const buf = React.useRef<T>({ ...(initial || {}) } as T);
  const reset = (next: T) => {
    buf.current = { ...(next || {}) } as T;
  };
  const setField = (k: string, v: any) => {
    buf.current[k] = v;
  };
  return { buf, reset, setField };
}

// Computed/linked fields we never send back to Airtable
const READ_ONLY_FIELDS = new Set<string>([
  "Full Name",
  "Experience Score",
  "Total Events",
  "Potential Revenue",
  "Created Date",
  "Client Inquiries",
]);


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
  const [record, setRecord] = React.useState<any>();
  const [loading, setLoading] = React.useState(true);
  const { buf, reset, setField } = useFormBuffer<Record<string, any>>({});

  React.useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      const r = await getRecord<any>("Speaker Applications", recordId);
      if (!alive) return;
      setRecord(r);
      reset(r?.fields || {});
      if (Array.isArray(r?.fields?.["Key Messages"]) && !r?.fields?.["Key Message"]) {
        buf.current["Key Message"] = r.fields["Key Messages"][0];
      }
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, [recordId]);

  async function handleSave(closeAfter = false) {
    if (!record) return;
    try {
      setSaving(true);
      const raw = { ...buf.current };

      if (typeof raw["Speaking Topics"] === "string") {
        raw["Speaking Topics"] = raw["Speaking Topics"].split(/\r?\n/).map(s => s.trim()).filter(Boolean);
      }

      if (!raw["Key Message"] && Array.isArray(raw["Key Messages"]) && raw["Key Messages"].length) {
        raw["Key Message"] = raw["Key Messages"][0];
      } else if (raw["Key Message"] && !Array.isArray(raw["Key Messages"])) {
        raw["Key Messages"] = [raw["Key Message"]];
      }

      const fields: Record<string, any> = {};
      for (const [k, v] of Object.entries(raw)) {
        if (READ_ONLY_FIELDS.has(k)) continue;
        fields[k] = v;
      }

      await airtablePatchRecord("Speaker Applications", record.id, fields);
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

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="modal__panel p-0">
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
              <TextArea id="Speaking Topics" rows={8} />
              <TextArea id="Key Message" rows={3} />
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
              <Badge label="Experience Score" value={record?.fields?.["Experience Score"]} />
              <Badge label="Total Events" value={record?.fields?.["Total Events (calc)"]} />
              <Badge label="Potential Revenue" value={record?.fields?.["Potential Revenue"]} />
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
      </DialogContent>
    </Dialog>
  );

  // ————— helpers —————
  function Text({ id, label }: { id: string; label?: string }) {
    return (
      <Field label={label ?? id}>
        <input
          className="input"
          name={id}
          defaultValue={buf.current[id] ?? record?.fields?.[id] ?? ""}
          onChange={(e) => setField(id, e.target.value)}
          placeholder={label ?? id}
        />
      </Field>
    );
  }
  function TextArea({ id, label, rows = 4 }: { id: string; label?: string; rows?: number }) {
    const defaultVal = id === "Speaking Topics"
      ? (Array.isArray(buf.current[id])
          ? (buf.current[id] as any[]).join("\n")
          : Array.isArray(record?.fields?.[id])
            ? (record?.fields?.[id] as any[]).join("\n")
            : buf.current[id] ?? record?.fields?.[id] ?? "")
      : (buf.current[id] ?? record?.fields?.[id] ?? "");
    return (
      <Field label={label ?? id}>
        <textarea
          className="textarea"
          name={id}
          rows={rows}
          defaultValue={defaultVal as string}
          onChange={(e) => setField(id, e.target.value)}
        />
      </Field>
    );
  }
  function Select({ id, options, label }: { id: string; options: string[]; label?: string }) {
    return (
      <Field label={label ?? id}>
        <select
          className="select"
          name={id}
          defaultValue={buf.current[id] ?? record?.fields?.[id] ?? ""}
          onChange={(e) => setField(id, e.target.value)}
        >
          <option value="">— Select —</option>
          {options.map(o => <option value={o} key={o}>{o}</option>)}
        </select>
      </Field>
    );
  }
  function Chips({ id, options, allowMulti = true }: { id: string; options: string[]; allowMulti?: boolean }) {
    const [_, force] = React.useReducer(x => x + 1, 0);
    const current = allowMulti
      ? (Array.isArray(buf.current[id])
          ? (buf.current[id] as string[])
          : Array.isArray(record?.fields?.[id])
            ? (record?.fields?.[id] as string[])
            : [])
      : (typeof buf.current[id] === "string"
          ? (buf.current[id] as string)
          : typeof record?.fields?.[id] === "string"
            ? (record?.fields?.[id] as string)
            : "");
    const toggle = (v: string) => {
      if (allowMulti) {
        const arr = current as string[];
        const next = arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v];
        setField(id, next);
      } else {
        const val = current as string;
        setField(id, val === v ? "" : v);
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
              className={`chip ${
                allowMulti ? (current as string[]).includes(v) : current === v ? "chip--on" : ""
              }`}
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
    const [_, force] = React.useReducer(x => x + 1, 0);
    const files = buf.current[id] ?? record?.fields?.[id];
    return (
      <Field label={label} hint={hint}>
        <div className="upload-row">
          <div className="upload-preview">
            {Array.isArray(files) && files.length ? (files as any[]).map((f, i) => (
              <img key={i} src={f.url ?? f} alt="" className="thumb" />
            )) : <div className="empty">No file selected</div>}
          </div>
          <UploadWidget
            onUpload={(uploaded) => {
              setField(id, uploaded);
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
    return (
      <Field label={id}>
        <input className="input" readOnly defaultValue={record?.fields?.[id] ?? ""} />
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
