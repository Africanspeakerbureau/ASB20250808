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

function normalizeMultiline(out) {
  if (Array.isArray(out)) return out.filter(Boolean).join("\n");
  return String(out ?? "").replace(/\r\n/g, "\n");
}

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
  const DRAFT_KEY = "asbApplyDraft:v1";
  const [tab, setTab] = React.useState("identity");
  const [form, setForm] = React.useState(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [submitting, setSubmitting] = React.useState(false);
  const [message, setMessage] = React.useState(null);

  const saveDraft = React.useCallback(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
  }, [form]);

  React.useEffect(() => {
    const t = setTimeout(() => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    }, 2000);
    return () => clearTimeout(t);
  }, [form]);

  function setField(name, value) {
    setForm(f => ({ ...f, [name]: value }));
  }

  const index = TABS.findIndex(t => t.key === tab);
  const total = TABS.length;

  async function handleSubmit() {
    try {
      setSubmitting(true);
      saveDraft();
      if (
        form["Profile Image"]?.[0]?.url?.startsWith("blob:") ||
        form["Header Image"]?.[0]?.url?.startsWith("blob:")
      ) {
        setMessage("Please finish upload before submitting.");
        return;
      }
      const prepared = { ...form };
      delete prepared.speakingTopicsText;
      delete prepared.keyMessagesText;
      const payload = toApplyV2Payload(prepared);
      payload["Speaking Topics"] = normalizeMultiline(
        form.speakingTopicsText ?? form["Speaking Topics"]
      );
      payload["Key Messages"] = normalizeMultiline(
        form.keyMessagesText ?? form["Key Messages"] ?? form.keyMessage
      );
      await submitApplication(payload);
      localStorage.removeItem(DRAFT_KEY);
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

          {/* Actions — sticky, centered on blue background */}
          <div className="mt-6 sticky top-14 sm:top-16 z-40">
            <div className="mx-auto max-w-5xl px-4">
              <div className="flex justify-center">
                <div
                  className="inline-flex flex-wrap items-center gap-2 rounded-2xl px-4 py-2 shadow-sm
                      bg-asb-navy/90 text-white backdrop-blur
                      [@supports(color:color(display-p3 1 1 1))]:bg-asb-navy/85
                      dark:bg-blue-900/90"
                  style={{ backgroundColor: "var(--asb-navy, #0b3a75)" }}
                >
                  <button
                    className="px-3 py-1.5 rounded border border-white/40 bg-white text-black"
                    disabled={index === 0}
                    onClick={() => setTab(TABS[Math.max(0, index - 1)].key)}
                  >
                    Back
                  </button>
                  <button
                    className="px-3 py-1.5 rounded border border-white/40 bg-white text-black"
                    onClick={saveDraft}
                  >
                    Save Draft
                  </button>
                  {index < total - 1 ? (
                    <button
                      className="px-3 py-1.5 rounded bg-black text-white hover:bg-black/80"
                      onClick={() => setTab(TABS[Math.min(total - 1, index + 1)].key)}
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      className="px-3 py-1.5 rounded bg-black text-white hover:bg-black/80"
                      onClick={handleSubmit}
                      disabled={submitting}
                    >
                      Submit
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {message && (
            <div className="mb-6 p-4 rounded-lg bg-blue-100 text-blue-800 text-center">{message}</div>
          )}

          {/* Keep a little gap between the blue bar and tabs */}
          <div className="mt-5 overflow-x-auto">
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
          </div>

          <div className="modal__body">
            <Card form={form} setField={setField} />
          </div>
        </div>
      </div>
      {/* Removed bottom fixed bar to prevent footer overlap */}
    </div>
  );
}
