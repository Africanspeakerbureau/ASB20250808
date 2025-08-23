import React from "react";

// Generic card and title
const Card: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ className = "", children }) => (
  <section className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>{children}</section>
);
const SectionTitle: React.FC<React.PropsWithChildren> = ({ children }) => (
  <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{children}</h2>
);

export default function SpeakerProfile({ speaker }: { speaker: Speaker }) {
  if (!speaker) return null;

  // Topics: split by ; or newline
  const topics: string[] = Array.isArray(speaker.speakingTopics)
    ? speaker.speakingTopics.filter(Boolean)
    : (speaker.speakingTopics || "")
        .split(/[\n;]+/)
        .map(s => s.trim())
        .filter(Boolean);

  return (
    <div className="container mx-auto px-4">
      {/* Header (image, name, title) stays as is */}

      {/* Action buttons: add gap below chips */}
      <div className="mt-4 flex flex-wrap gap-3">
        {/* Contact / Share profile / Back to search */}
      </div>

      {/* ROW 1 — What You’ll Get (2 cols) + Quick facts (1 col) */}
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <Card className="p-6 md:col-span-2">
          <SectionTitle>What You’ll Get</SectionTitle>
          <div className="mt-4 space-y-6 text-slate-800">
            {speaker.keyMessages && (
              <div>
                <h3 className="font-semibold">Key Messages</h3>
                <p className="mt-1">{speaker.keyMessages}</p>
              </div>
            )}
            {speaker.deliveryStyle && (
              <div>
                <h3 className="font-semibold">Delivery Style</h3>
                <p className="mt-1">{speaker.deliveryStyle}</p>
              </div>
            )}
            {speaker.whyThisSpeaker && (
              <div>
                <h3 className="font-semibold">Why This Speaker</h3>
                <p className="mt-1">{speaker.whyThisSpeaker}</p>
              </div>
            )}
            {speaker.willAddress && (
              <div>
                <h3 className="font-semibold">What the speeches will address</h3>
                <p className="mt-1">{speaker.willAddress}</p>
              </div>
            )}
            {speaker.learnersWillLearn && (
              <div>
                <h3 className="font-semibold">What participants will learn</h3>
                <p className="mt-1">{speaker.learnersWillLearn}</p>
              </div>
            )}
            {speaker.audienceTakeHome && (
              <div>
                <h3 className="font-semibold">What the audience will take home</h3>
                <p className="mt-1">{speaker.audienceTakeHome}</p>
              </div>
            )}
            {(speaker.benefitsIndividual || speaker.benefitsOrganisation) && (
              <>
                {speaker.benefitsIndividual && (
                  <div>
                    <h3 className="font-semibold">Benefits: Individual</h3>
                    <p className="mt-1">{speaker.benefitsIndividual}</p>
                  </div>
                )}
                {speaker.benefitsOrganisation && (
                  <div>
                    <h3 className="font-semibold">Benefits: Organisation</h3>
                    <p className="mt-1">{speaker.benefitsOrganisation}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <SectionTitle>Quick facts</SectionTitle>
          <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
            <dt className="text-slate-500">Country</dt>
            <dd className="text-slate-900">{speaker.country || "—"}</dd>
            <dt className="text-slate-500">Languages</dt>
            <dd className="text-slate-900">
              {(speaker.languages && speaker.languages.join(", ")) || speaker.language || "—"}
            </dd>
            <dt className="text-slate-500">Availability</dt>
            <dd className="text-slate-900">{speaker.availability || "—"}</dd>
            <dt className="text-slate-500">Fee range</dt>
            <dd className="text-slate-900">{speaker.displayFee || speaker.feeRange || "On request"}</dd>
          </dl>
        </Card>
      </div>

      {/* ROW 2 — Speaking Topics (2 cols) + Expertise areas (1 col) */}
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <Card className="p-6 md:col-span-2">
          <SectionTitle>Speaking Topics</SectionTitle>
          {topics.length > 0 ? (
            <ul className="mt-4 list-disc space-y-2 pl-6">
              {topics.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-slate-700">—</p>
          )}
        </Card>
        <Card className="p-6">
          <SectionTitle>Expertise areas</SectionTitle>
          <div className="mt-4 flex flex-wrap gap-2">
            {(speaker.expertiseAreas || []).map((tag: string) => (
              <span
                key={tag}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700"
              >
                {tag}
              </span>
            ))}
          </div>
        </Card>
      </div>

      {/* ABOUT */}
      {(speaker.professionalBio || speaker.achievements || speaker.education) && (
        <Card className="p-6 mt-6">
          <SectionTitle>About</SectionTitle>
          <div className="mt-4 space-y-6">
            {speaker.professionalBio && (
              <div>
                <h3 className="font-semibold">Professional Bio</h3>
                <p className="mt-1">{speaker.professionalBio}</p>
              </div>
            )}
            {speaker.achievements && (
              <div>
                <h3 className="font-semibold">Achievements</h3>
                <p className="mt-1">{speaker.achievements}</p>
              </div>
            )}
            {speaker.education && (
              <div>
                <h3 className="font-semibold">Education</h3>
                <p className="mt-1">{speaker.education}</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* TRACK RECORD */}
      {(speaker.notableAchievements || speaker.otherAchievements) && (
        <Card className="p-6 mt-6">
          <SectionTitle>Track Record</SectionTitle>
          <div className="mt-4 space-y-6">
            {speaker.notableAchievements && (
              <div>
                <h3 className="font-semibold">Notable Achievements</h3>
                <p className="mt-1">{speaker.notableAchievements}</p>
              </div>
            )}
            {speaker.otherAchievements && (
              <div>
                <h3 className="font-semibold">Further achievements</h3>
                <p className="mt-1">{speaker.otherAchievements}</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Videos + Related speakers remain as is */}
    </div>
  );
}

