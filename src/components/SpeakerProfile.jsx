import React from "react";
import "./speakerProfile.css";
import { normalizeSpeaker } from "../lib/normalizeSpeaker";

export default function SpeakerProfile({ record }) {
  if (!record) return null;
  const speaker = normalizeSpeaker(record);

  return (
    <div className="speaker-profile">
      {/* Header (unchanged structure) */}
      <header className="header">
        {/* Your existing avatar/name/title/badges/buttons block stays as-is */}
        {/* ... */}
      </header>

      {/* Two-column content */}
      <div className="profile-grid">
        {/* LEFT COLUMN */}
        <div>
          {/* Key Messages (aligned to Quick facts via CSS offset) */}
          {speaker.keyMessages && (
            <section className="card keymessages-offset">
              <h2>Key Messages</h2>
              <p>{speaker.keyMessages}</p>
            </section>
          )}

          {/* About */}
          <section className="card">
            <h2>About</h2>
            {speaker.bio ? <p>{speaker.bio}</p> : null}
            {speaker.achievements && (
              <>
                <h3 style={{marginTop: 16, marginBottom: 8}}>Achievements</h3>
                <p>{speaker.achievements}</p>
              </>
            )}
            {speaker.notableAchievements && (
              <>
                <h3 style={{marginTop: 16, marginBottom: 8}}>Further achievements</h3>
                <p>{speaker.notableAchievements}</p>
              </>
            )}
            {speaker.education && (
              <>
                <h3 style={{marginTop: 16, marginBottom: 8}}>Education</h3>
                <p>{speaker.education}</p>
              </>
            )}
          </section>

          {/* Speaking Topics — bullets from semicolons/newlines */}
          {speaker.speakingTopics?.length > 0 && (
            <section className="card">
              <h2>Speaking Topics</h2>
              <ul className="bullets">
                {speaker.speakingTopics.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </section>
          )}

          {/* What You’ll Get — NEW card */}
          {(speaker.talk?.deliveryStyle ||
            speaker.talk?.whyThisSpeaker ||
            speaker.talk?.willAddress ||
            speaker.talk?.willLearn ||
            speaker.talk?.takeHome ||
            speaker.talk?.benefitsIndividual ||
            speaker.talk?.benefitsOrganisation) && (
            <section className="card">
              <h2>What You’ll Get</h2>

              {speaker.talk.deliveryStyle && (
                <>
                  <h3 style={{marginTop: 8, marginBottom: 6}}>Delivery Style</h3>
                  <p>{speaker.talk.deliveryStyle}</p>
                </>
              )}

              {speaker.talk.whyThisSpeaker && (
                <>
                  <h3 style={{marginTop: 12, marginBottom: 6}}>Why This Speaker</h3>
                  <p>{speaker.talk.whyThisSpeaker}</p>
                </>
              )}

              {speaker.talk.willAddress && (
                <>
                  <h3 style={{marginTop: 12, marginBottom: 6}}>What the speeches will address</h3>
                  <p>{speaker.talk.willAddress}</p>
                </>
              )}

              {speaker.talk.willLearn && (
                <>
                  <h3 style={{marginTop: 12, marginBottom: 6}}>What participants will learn</h3>
                  <p>{speaker.talk.willLearn}</p>
                </>
              )}

              {speaker.talk.takeHome && (
                <>
                  <h3 style={{marginTop: 12, marginBottom: 6}}>What the audience will take home</h3>
                  <p>{speaker.talk.takeHome}</p>
                </>
              )}

              {speaker.talk.benefitsIndividual && (
                <>
                  <h3 style={{marginTop: 12, marginBottom: 6}}>Benefits: Individual</h3>
                  <p>{speaker.talk.benefitsIndividual}</p>
                </>
              )}

              {speaker.talk.benefitsOrganisation && (
                <>
                  <h3 style={{marginTop: 12, marginBottom: 6}}>Benefits: Organisation</h3>
                  <p>{speaker.talk.benefitsOrganisation}</p>
                </>
              )}
            </section>
          )}

          {/* Keep your existing Videos and Related Speakers blocks below */}
          {/* <Videos .../> */}
          {/* <RelatedSpeakers .../> */}
        </div>

        {/* RIGHT COLUMN */}
        <aside>
          {/* Quick facts */}
          <section className="card">
            <h2>Quick facts</h2>
            <div style={{display:"grid",gridTemplateColumns:"120px 1fr",rowGap:8}}>
              <div>Country</div><div>{speaker.country || "—"}</div>
              <div>Languages</div><div>{Array.isArray(speaker.languages) ? speaker.languages.join(", ") : (speaker.languages || "—")}</div>
              <div>Availability</div><div>{speaker.availability || "—"}</div>
              <div>Fee range</div><div>{speaker.feeRange || "On request (TBD)"}</div>
            </div>
          </section>

          {/* Expertise areas */}
          {speaker.expertiseAreas?.length > 0 && (
            <section className="card">
              <h2>Expertise areas</h2>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {speaker.expertiseAreas.map((tag, i) => (
                  <span key={i} style={{
                    display:"inline-block",
                    padding:"6px 10px",
                    border:"1px solid #e5e7eb",
                    borderRadius:999,
                    fontSize:13
                  }}>{tag}</span>
                ))}
              </div>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}
