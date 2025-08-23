import React, { useEffect, useState, useMemo } from 'react';
import SpeakerCard from '../SpeakerCard';
import { listSpeakersAll } from '@/lib/airtable';
import { getAllPublishedSpeakersCached, computeRelatedSpeakers } from '@/lib/speakers';

export default function RelatedSpeakers({ speaker }) {
  const [related, setRelated] = useState(null);

  const current = useMemo(() => {
    if (!speaker) return { id: '', slug: '' };
    return {
      id: speaker.id,
      slug: speaker.slug,
      country: speaker.country || '',
      languages: speaker.languages || speaker.spokenLanguages || [],
      expertise: speaker.expertiseAreas || speaker.expertise || [],
      featured: !!speaker.featured,
    };
  }, [speaker]);

  useEffect(() => {
    if (!current.id) return;
    let alive = true;
    (async () => {
      try {
        const all = await getAllPublishedSpeakersCached(listSpeakersAll);
        const picks = computeRelatedSpeakers(current, all, 3);
        if (alive) setRelated(picks);
      } catch (e) {
        console.error('Related speakers failed:', e);
        if (alive) setRelated([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, [current.id, current.slug]);

  if (related === null) {
    return (
      <section className="card">
        <h2 className="card-title">Related speakers</h2>
        <div className="grid md:grid-cols-3 gap-4 opacity-60">
          <div className="rounded-xl border p-6">Card placeholder</div>
          <div className="rounded-xl border p-6">Card placeholder</div>
          <div className="rounded-xl border p-6">Card placeholder</div>
        </div>
      </section>
    );
  }

  if (!related.length) return null;

  return (
    <section className="card">
      <h2 className="card-title">Related speakers</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {related.map(s => (
          <SpeakerCard
            key={s.id}
            speaker={{
              ...s,
              name: s.fullName,
              spokenLanguages: s.languages,
              expertiseAreas: s.expertise,
            }}
            variant="compact"
          />
        ))}
      </div>
    </section>
  );
}
