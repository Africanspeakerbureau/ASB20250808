import React from "react";
import Header from "@/components/Header.jsx";
import {
  IdentityCardPublic,
  BackgroundCardPublic,
  ExperienceCardPublic,
  ExpertiseCardPublic,
  WhyBookingCardPublic,
  MediaLanguagesCardPublic,
  LogisticsFeesCardPublic,
  ContactAdminCardPublic,
} from "./cardsIndex";
import { toApplyV2Payload } from "./mapAdminCardsToApplyV2";
import { submitApplication } from "@/lib/apply";
import "@/admin/components/Edit/editDialog.css";

const TABS = [
  { key: "identity", label: "Identity" },
  { key: "background", label: "Background" },
  { key: "experience", label: "Experience" },
  { key: "expertise", label: "Expertise & Content" },
  { key: "why", label: "Why booking" },
  { key: "media", label: "Media & Languages" },
  { key: "logistics", label: "Logistics & Fees" },
  { key: "contact", label: "Contact & Admin" },
];

const CARD_COMPONENTS = {
  identity: IdentityCardPublic,
  background: BackgroundCardPublic,
  experience: ExperienceCardPublic,
  expertise: ExpertiseCardPublic,
  why: WhyBookingCardPublic,
  media: MediaLanguagesCardPublic,
  logistics: LogisticsFeesCardPublic,
  contact: ContactAdminCardPublic,
};

export default function ApplyBeta({ countryCode = "ZA", currency = "ZAR" }) {
  const [tab, setTab] = React.useState("identity");
  const [form, setForm] = React.useState(() => {
    try {
      const saved = localStorage.getItem("asbApplyDraft:v1");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [submitting, setSubmitting] = React.useState(false);
  const [message, setMessage] = React.useState(null);

  React.useEffect(() => {
    localStorage.setItem("asbApplyDraft:v1", JSON.stringify(form));
  }, [form]);

  function setField(name, value) {
    setForm(f => ({ ...f, [name]: value }));
  }

  const index = TABS.findIndex(t => t.key === tab);

  async function handleSubmit() {
    try {
      setSubmitting(true);
      const payload = toApplyV2Payload(form);
      await submitApplication(payload);
      localStorage.removeItem("asbApplyDraft:v1");
      setMessage("Application submitted successfully!");
    } catch (e) {
      setMessage(e.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  const Card = CARD_COMPONENTS[tab];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header countryCode={countryCode} currency={currency} />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight text-center">Join as Speaker</h1>
          <p className="mt-3 text-slate-600 text-center">
            Share your expertise with global audiences and become part of Africa's premier speaker network
          </p>
          <div className="mt-6 max-w-3xl mx-auto px-4 text-center">
            <p className="text-slate-700 leading-relaxed">
              Thank you for your interest in speaking with African Speaker Bureau. Please share as much detail as you can—fields marked * are required; the rest are optional. The more we know about your expertise and formats, the better we can match you with the right stages and clients. We look forward to partnering with you.
            </p>
          </div>

          {message && (
            <div className="mb-6 p-4 rounded-lg bg-blue-100 text-blue-800 text-center">{message}</div>
          )}

          <div className="tabs">
            {TABS.map(t => (
              <button
                key={t.key}
                className={`tab ${tab === t.key ? "tab--active" : ""}`}
                onClick={() => setTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="modal__body">
            <Card form={form} setField={setField} />
          </div>
        </div>
      </div>

      <div className="modal__footer fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-between">
        <button className="btn" disabled={index === 0 || submitting} onClick={() => setTab(TABS[index - 1].key)}>
          Back
        </button>
        <div className="flex gap-2">
          <button className="btn" disabled={submitting} onClick={() => localStorage.setItem("asbApplyDraft:v1", JSON.stringify(form))}>
            Save Draft
          </button>
          {index < TABS.length - 1 ? (
            <button className="btn btn--primary" disabled={submitting} onClick={() => setTab(TABS[index + 1].key)}>
              Next
            </button>
          ) : (
            <button className="btn btn--primary" disabled={submitting} onClick={handleSubmit}>
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
