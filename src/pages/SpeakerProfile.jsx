import React from "react";
import { useSpeaker } from "../hooks/useSpeaker";
import About from "../components/About";
import Videos from "../components/Videos";
import RelatedSpeakers from "../components/RelatedSpeakers";
import WhatYoullGetCard from "../components/profile/WhatYoullGetCard";
import TrackRecordCard from "../components/profile/TrackRecordCard";
import SidebarInfo from "../components/profile/SidebarInfo";

export default function SpeakerProfile() {
  const { speaker: s, loading, error } = useSpeaker();

  if (loading) return <div className="page">Loading…</div>;
  if (error || !s) return <div className="page">Could not load speaker.</div>;

  return (
    <div className="page container space-y-6">
      {/* hero/header already here */}

      {/* Re-order for mobile: sidebar (Quick facts) appears right under Back to search (order-1),
          but on desktop it sits on the right (order-2). */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="order-1 md:order-2 md:col-span-4">
          <SidebarInfo speaker={s} />
        </div>

        <div className="order-2 md:order-1 md:col-span-8 space-y-6">
          <WhatYoullGetCard speaker={s} />
          <About html={s.bio} />
          <Videos speaker={s} />
          <RelatedSpeakers current={s} />
        </div>
      </div>

      {/* Track record (Notable / Other / Education) */}
      <TrackRecordCard speaker={s} />
    </div>
  );
}

