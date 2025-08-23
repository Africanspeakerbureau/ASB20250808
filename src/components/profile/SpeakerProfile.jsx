import React from 'react';
import QuickFacts from './QuickFacts';
import ExpertiseAreas from './ExpertiseAreas';
import KeyMessages from './KeyMessages';
import About from './About';
import SpeakingTopics from './SpeakingTopics';
import Videos from './Videos';
import RelatedSpeakers from './RelatedSpeakers';
import WhatYoullGetCard from './WhatYoullGetCard';
import './profile-layout.css';

export default function SpeakerProfile({ speaker }) {
  if (!speaker) return null;

  return (
    <>
      {/* HERO stays as-is */}
      <div className="profile-grid">
        <main>
          {/* Nudge Key Messages down on desktop only to align with Quick facts */}
          <div className="keymessages-offset">
            <KeyMessages text={speaker.keyMessages} />
          </div>

          {/* NEW: What You’ll Get */}
          <WhatYoullGetCard wyg={speaker.whatYoullGet} />

          <SpeakingTopics topics={speaker.speakingTopics} />
          <About speaker={speaker} />
          <Videos videos={speaker.videos} />
          <RelatedSpeakers speaker={speaker} />
        </main>
        <aside>
          <QuickFacts
            country={speaker.country}
            languages={speaker.languages}
            availability={speaker.availability}
            feeRange={speaker.feeRange}
          />
          <ExpertiseAreas areas={speaker.expertiseAreas} />
        </aside>
      </div>
    </>
  );
}
