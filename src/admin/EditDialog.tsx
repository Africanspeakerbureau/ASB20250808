import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import {
  INDUSTRIES, YEARS_EXPERIENCE, SPEAKING_EXPERIENCE, NUMBER_OF_EVENTS, LARGEST_AUDIENCE,
  VIRTUAL_EXPERIENCE, EXPERTISE_AREAS, SPOKEN_LANGUAGES, COUNTRIES, FEE_RANGE,
  TRAVEL_WILLINGNESS, FEATURED, STATUS, EXPERTISE_LEVEL, DISPLAY_FEE
} from "./edit/options";
import UploadWidget from "@/components/UploadWidget";
import { useToast } from "@/components/Toast";
import { buildFields } from "./shapeSpeakerPayload";
import { F } from "./fieldMap";
import "./editDialog.css";

type RecordLike = {
  id: string;
  fields: Record<string, any>;
};

type Props = {
  open: boolean;
  record: RecordLike | null;
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

export default function EditDialog({ open, record, onClose }: Props) {
  const { push } = useToast();
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<TabKey>("Identity");

  const initial = useMemo(() => {
    const f = record?.fields ?? {};
    return {
      // Identity
      "First Name": f["First Name"] ?? "",
      "Last Name": f["Last Name"] ?? "",
      "Title": f["Title"] ?? "",
      "Professional Title": f["Professional Title"] ?? "",
      "Company": f["Company"] ?? "",
      "Location": f["Location"] ?? "",
      "Country": f["Country"] ?? "",
      "Profile Image": f["Profile Image"] ?? [],
      profileImageUrls: Array.isArray(f["Profile Image"]) ? f["Profile Image"].map((x:any) => x.url ?? x) : [],

      // Background
      "Industry": f["Industry"] ?? "",
      "Expertise Level": f["Expertise Level"] ?? "",
      "Years Experience": f["Years Experience"] ?? "",
      "Notable Achievements": f["Notable Achievements"] ?? "",
      "Achievements": f["Achievements"] ?? "",
      "Education": f["Education"] ?? "",

      // Experience
      "Speaking Experience": f["Speaking Experience"] ?? "",
      "Number of Events": f["Number of Events"] ?? "",
      "Largest Audience": f["Largest Audience"] ?? "",
      "Virtual Experience": f["Virtual Experience"] ?? "",

      // Expertise & Content
      "Expertise Areas": f["Expertise Areas"] ?? [],
      "Speaking Topics": f["Speaking Topics"] ?? "",
      "Key Messages": f["Key Messages"] ?? "",
      "Professional Bio": f["Professional Bio"] ?? "",

      // Why booking
      "Speakers Delivery Style": f["Speakers Delivery Style"] ?? "",
      "Why the audience should listen to these topics": f["Why the audience should listen to these topics"] ?? "",
      "What the speeches will address": f["What the speeches will address"] ?? "",
      "What participants will learn": f["What participants will learn"] ?? "",
      "What the audience will take home": f["What the audience will take home"] ?? "",
      "Benefits for the individual": f["Benefits for the individual"] ?? "",
      "Benefits for the organisation": f["Benefits for the organisation"] ?? "",

      // Media & Languages
      "Header Image": f["Header Image"] ?? [],
      headerImageUrls: Array.isArray(f["Header Image"]) ? f["Header Image"].map((x:any) => x.url ?? x) : [],
      "Video Link 1": f["Video Link 1"] ?? "",
      "Video Link 2": f["Video Link 2"] ?? "",
      "Video Link 3": f["Video Link 3"] ?? "",
      "Spoken Languages": f["Spoken Languages"] ?? [],

      // Logistics & Fees
      "Fee Range": f["Fee Range"] ?? "",
      "Display Fee": f["Display Fee"] ?? "",
      "Travel Willingness": f["Travel Willingness"] ?? "",
      "Travel Requirements": f["Travel Requirements"] ?? "",

      // Contact & Admin
      "Website": f["Website"] ?? "",
      "LinkedIn": f["LinkedIn"] ?? "",
      "Twitter": f["Twitter"] ?? "",
      "References": f["References"] ?? "",
      "PA Name": f["PA Name"] ?? "",
      "PA Email": f["PA Email"] ?? "",
      "PA Phone": f["PA Phone"] ?? "",
      "Banking Details": f["Banking Details"] ?? "",
      "Special Requirements": f["Special Requirements"] ?? "",
      "Additional Info": f["Additional Info"] ?? "",

      // Internal
      "Status": f["Status"] ?? [],
      "Featured": f["Featured"] ?? "",
      "Created Date": f["Created Date"] ?? "",
      "Client Inquiries": Array.isArray(f["Client Inquiries"]) ? f["Client Inquiries"].length : (f["Client Inquiries"] ?? 0),
      "Experience Score": f["Experience Score"] ?? "",
      "Total Events (calc)": f["Total Events"] ?? "",
      "Potential Revenue": f["Potential Revenue"] ?? "",
      "Internal Notes": f["Internal Notes"] ?? "",
    };
  }, [record]);

  const [draft, setDraft] = useState(initial);
  useEffect(() => setDraft(initial), [initial]);

  async function onSave(closeAfter = true) {
    try {
      setSaving(true);
      const state = {
        firstName: draft[F.FirstName],
        lastName: draft[F.LastName],
        title: draft[F.Title],
        professionalTitle: draft[F.ProfessionalTitle],
        company: draft[F.Company],
        location: draft[F.Location],
        country: draft[F.Country],
        industry: draft[F.Industry],
        expertiseLevel: draft[F.ExpertiseLevel],
        yearsExperience: draft[F.YearsExperience],
        notableAchievements: draft[F.NotableAchievements],
        achievements: draft[F.Achievements],
        education: draft[F.Education],

        speakingExperience: draft[F.SpeakingExperience],
        numberEvents: draft[F.NumberEvents],
        largestAudience: draft[F.LargestAudience],
        virtualExperience: draft[F.VirtualExperience],

        expertiseAreas: draft[F.ExpertiseAreas],
        speakingTopics: draft[F.SpeakingTopics],
        keyMessages: draft[F.KeyMessages],
        professionalBio: draft[F.ProfessionalBio],

        deliveryStyle: draft[F.DeliveryStyle],
        whyListen: draft[F.WhyListen],
        willAddress: draft[F.WillAddress],
        willLearn: draft[F.WillLearn],
        takeHome: draft[F.TakeHome],
        benefitIndividual: draft[F.BenefitIndividual],
        benefitOrg: draft[F.BenefitOrg],

        video1: draft[F.Video1],
        video2: draft[F.Video2],
        video3: draft[F.Video3],
        spokenLanguages: draft[F.SpokenLanguages],

        feeRange: draft[F.FeeRange],
        displayFee: draft[F.DisplayFee],
        travelWillingness: draft[F.TravelWillingness],
        travelRequirements: draft[F.TravelRequirements],

        website: draft[F.Website],
        linkedin: draft[F.LinkedIn],
        twitter: draft[F.Twitter] || draft["Twitter"],
        references: draft[F.References],
        paName: draft[F.PAName],
        paEmail: draft[F.PAEmail],
        paPhone: draft[F.PAPhone],
        banking: draft[F.Banking],
        additionalInfo: draft[F.AdditionalInfo],

        status: draft[F.Status],
        featured: draft[F.Featured],
        internalNotes: draft[F.InternalNotes],
        profileImageUrls: Array.isArray(draft[F.ProfileImage])
          ? draft[F.ProfileImage].map((f: any) => f.url ?? f)
          : draft.profileImageUrls || [],
        headerImageUrls: Array.isArray(draft[F.HeaderImage])
          ? draft[F.HeaderImage].map((f: any) => f.url ?? f)
          : draft.headerImageUrls || [],
      };
      const fields = buildFields(state);
      const res = await fetch("/api/admin/speakers/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recordId: record.id, fields }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Save failed");
      push({ text: "Saved ✔︎", type: "success" });
      if (closeAfter) onClose();
    } catch (e: any) {
      push({ text: e?.message || "Could not save", type: "error" });
    } finally {
      setSaving(false);
    }
  }

  if (!open || !record) return null;

  return ReactDOM.createPortal(
    <div className="modal">
      <div className="modal__panel" role="dialog" aria-modal="true">
        <div className="modal__header">
          <h2>Edit</h2>
          <button className="icon-btn" aria-label="Close" onClick={onClose}>✕</button>
        </div>

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
              <Badge label="Experience Score" value={draft["Experience Score"]} />
              <Badge label="Total Events" value={draft["Total Events (calc)"]} />
              <Badge label="Potential Revenue" value={draft["Potential Revenue"]} />
              <Upload id="Header Image" label="Header Image" hint="This is the wide banner image" />
              <TextArea id="Internal Notes" />
            </Grid>
          )}
        </div>

        <div className="modal__footer">
          <button className="btn" disabled={saving} onClick={onClose}>Close</button>
          <button className="btn" disabled={saving} onClick={() => onSave(false)}>
            {saving ? "Saving…" : "Save"}
          </button>
          <button className="btn btn--primary" disabled={saving} onClick={() => onSave(true)}>
            {saving ? "Saving…" : "Save & Close"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );

  // ————— helpers —————
  function set(id: string, val: any) {
    setDraft(d => ({ ...d, [id]: val }));
  }
  function Text({ id, label }: { id: string; label?: string }) {
    return (
      <Field label={label ?? id}>
        <input
          className="input"
          value={draft[id] ?? ""}
          onChange={e => set(id, e.target.value)}
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
          value={draft[id] ?? ""}
          onChange={e => set(id, e.target.value)}
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
          value={draft[id] ?? ""}
          onChange={e => set(id, e.target.value)}
        >
          <option value="">— Select —</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </Field>
    );
  }
  function Chips({ id, options, allowMulti = true }: { id: string; options: string[]; allowMulti?: boolean }) {
    const value: string[] = Array.isArray(draft[id]) ? draft[id] : (draft[id] ? String(draft[id]).split(",").map(s => s.trim()) : []);
    const toggle = (v: string) => {
      if (allowMulti) {
        const next = value.includes(v) ? value.filter(x => x !== v) : [...value, v];
        set(id, next);
      } else {
        set(id, value.includes(v) ? "" : v);
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
    const files = draft[id] as any[];
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
              set(id, uploaded);
              if (id === F.ProfileImage) {
                set("profileImageUrls", uploaded.map((f: any) => f.url));
              }
              if (id === F.HeaderImage) {
                set("headerImageUrls", uploaded.map((f: any) => f.url));
              }
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
        <input className="input" readOnly value={draft[id] ?? ""} />
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
