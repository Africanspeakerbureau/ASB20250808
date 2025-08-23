import React from "react";
import { useSpeaker } from "../hooks/useSpeaker";
import QuickFacts from "../components/QuickFacts";
import KeyMessages from "../components/KeyMessages";
import About from "../components/About";
import Videos from "../components/Videos";
import RelatedSpeakers from "../components/RelatedSpeakers";
import SpeakerWhatYouGet from "../components/sections/SpeakerWhatYouGet";
import SpeakerTrackRecord from "../components/sections/SpeakerTrackRecord";
import SidebarExpertiseLanguages from "../components/sections/SidebarExpertiseLanguages";

export default function SpeakerProfile() {
  const { speaker: s, loading, error } = useSpeaker();

  if (loading) return <div className="page">Loading…</div>;
  if (error || !s) return <div className="page">Could not load speaker.</div>;

  return (
    <div className="page container space-y-6">
      {/* hero/header already here */}

      {/* Re-order for mobile: sidebar (Quick facts) appears right under Back to search (order-1),
          but on desktop it sits on the right (order-2). */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <aside className="order-1 lg:order-2 lg:col-span-4 space-y-6 mt-4">
          <QuickFacts speaker={s} />
          <SidebarExpertiseLanguages expertiseAreas={s.expertiseAreas} languages={s.languages} />
        </aside>

        <div className="order-2 lg:order-1 lg:col-span-8 space-y-6">
          <KeyMessages text={s.keyMessages} />
          <SpeakerWhatYouGet s={s} />
          <About html={s.bio} />
          <Videos speaker={s} />
          <RelatedSpeakers current={s} />
        </div>
      </div>

      {/* Track record (Notable / Other / Education) */}
      <SpeakerTrackRecord s={s} />
    </div>
  );
}

