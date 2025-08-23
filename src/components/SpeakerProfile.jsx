import React, { useMemo, useEffect, useState } from 'react';
import SpeakerCard from './SpeakerCard';
import { listSpeakersAll } from '@/lib/airtable';
import { getAllPublishedSpeakersCached, computeRelatedSpeakers } from '@/lib/speakers';
import VideoEmbed from './VideoEmbed'
import WhatYoullGetCard from '@/components/profile/WhatYoullGetCard';
import TrackRecordCard from '@/components/profile/TrackRecordCard';
import QuickFacts from './QuickFacts';
import SpeakingTopics from './SpeakingTopics';

function Chip({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border px-2.5 py-1 text-sm text-gray-700 bg-white shadow-sm">
      {children}
    </span>
  )
}


export default function SpeakerProfile({ id, speakers = [] }) {
  useEffect(() => {
    setTimeout(() => window.scrollTo({ top: 0, left: 0, behavior: 'auto' }), 0)
  }, [])

  const speaker = useMemo(() => {
    if (!id) return null
    const needle = decodeURIComponent(id).toLowerCase()
    return (
      speakers.find(s =>
        String(s.id || '').toLowerCase() === needle ||
        String(s.slug || '').toLowerCase() === needle
      ) || null
    )
  }, [id, speakers])

  const [related, setRelated] = useState(null);

  const currentSpeaker = useMemo(() => {
    if (!speaker) return { id: "", slug: "", country: "", languages: [], expertise: [], featured: false };
    return {
      id: speaker.id,
      slug: speaker.slug,
      country: speaker.country || "",
      languages: speaker.languages || speaker.spokenLanguages || [],
      expertise: speaker.expertiseAreas || speaker.expertise || [],
      featured: !!speaker.featured,
    };
  }, [speaker]);

  useEffect(() => {
    if (!currentSpeaker.id) return;
    let alive = true;
    (async () => {
      try {
        const all = await getAllPublishedSpeakersCached(listSpeakersAll);
        const picks = computeRelatedSpeakers(currentSpeaker, all, 3);
        if (alive) setRelated(picks);
      } catch (e) {
        console.error("Related speakers failed:", e);
        if (alive) setRelated([]);
      }
    })();
    return () => { alive = false; };
  }, [currentSpeaker.id, currentSpeaker.slug]);

  if (!speaker) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="text-xl font-semibold mb-2">Speaker not found</h1>
        <p className="text-gray-600">
          We couldn’t locate that profile.{' '}
          <a
            className="text-blue-600 underline"
            href="#/find-speakers"
            onClick={(e)=>{e.preventDefault(); window.history.pushState({}, '', '#/find-speakers'); window.dispatchEvent(new PopStateEvent('popstate'));}}
          >
            Return to Find Speakers
          </a>.
        </p>
      </main>
    )
  }

  const fullName = [speaker.titlePrefix, speaker.firstName, speaker.lastName].filter(Boolean).join(' ')
  const videos = speaker.videos || []

  const shareUrl = `${window.location.origin}/#/speaker/${encodeURIComponent(
    (speaker.slug || speaker.id || '').toLowerCase()
  )}`

  const onShare = async () => {
    try {
      const shareData = {
        title: `${fullName || speaker.title || 'ASB Speaker'}`,
        text: 'Check out this speaker from African Speaker Bureau',
        url: shareUrl,
      }
      if (navigator.share) {
        await navigator.share(shareData)
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl)
        alert('Profile link copied to clipboard.')
      } else {
        prompt('Copy this link:', shareUrl)
      }
    } catch (e) {
      console.error('Share failed:', e)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24">
      {speaker.headerUrl && (
        <div className="h-40 w-full rounded-xl overflow-hidden bg-neutral-100">
          <img src={speaker.headerUrl} alt="" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="max-w-6xl mx-auto mt-8 md:mt-12">
        <div className="flex flex-col md:flex-row gap-4">
          {speaker.photoUrl ? (
            <img
              className="w-32 h-32 rounded-2xl object-cover"
              src={speaker.photoUrl}
              alt={fullName}
            />
          ) : (
            <div className="w-32 h-32 rounded-2xl bg-gray-100 grid place-content-center text-gray-400 text-sm">No image</div>
          )}
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">{fullName}</h1>
            {speaker.title && (
              <p className="mt-1 text-base md:text-lg text-slate-600">{speaker.title}</p>
            )}

            <div className="flex flex-wrap gap-2 mt-3">
              {speaker.languages?.length > 0 && <Chip>{speaker.languages.join(', ')}</Chip>}
              {speaker.country && <Chip>{speaker.country}</Chip>}
              {speaker.travelWillingness && <Chip>{speaker.travelWillingness}</Chip>}
              {speaker.feeRange && <Chip>{speaker.feeRange}</Chip>}
            </div>

            <div className="mt-4 mb-2 sm:mb-0 flex flex-wrap gap-3">
              <a
                href="#/book-a-speaker"
                className="inline-flex items-center rounded-xl bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700"
              >
                Contact {speaker.firstName}
              </a>
              <button
                type="button"
                className="inline-flex items-center rounded-xl border px-4 py-2 text-gray-800 bg-white shadow-sm"
                onClick={onShare}
              >
                Share profile
              </button>
              <a
                href="#/find-speakers"
                onClick={(e)=>{e.preventDefault(); window.history.pushState({}, '', '#/find-speakers'); window.dispatchEvent(new PopStateEvent('popstate'));}}
                className="inline-flex items-center rounded-xl border px-4 py-2 text-gray-800 bg-white shadow-sm"
              >
                Back to search
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 md:gap-6">
        <div className="order-1 md:order-2 md:col-span-4 mt-4 md:mt-0">
          <QuickFacts speaker={speaker} />
        </div>
        <main className="order-2 md:order-1 md:col-span-8 space-y-6">
          <WhatYoullGetCard speaker={speaker} />
          <SpeakingTopics topics={speaker.topics} />

          {speaker.bio && (
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold mb-3">About</h2>
              <p className="text-gray-700 whitespace-pre-line">{speaker.bio}</p>
            </div>
          )}

          <TrackRecordCard speaker={speaker} />

          {videos.length > 0 && (
            <section id="videos" className="mt-10">
              <h2 className="text-2xl font-semibold mb-4">Videos</h2>
              <div className="video-grid">
                {videos.map((url, i) => (
                  <VideoEmbed key={i} url={url} title={`Video ${i + 1} — ${fullName}`} />
                ))}
              </div>
            </section>
          )}
          {related === null ? (
            <section className="mt-8 rounded-2xl border bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Related speakers</h2>
              <div className="grid md:grid-cols-3 gap-4 opacity-60">
                <div className="rounded-xl border p-6">Card placeholder</div>
                <div className="rounded-xl border p-6">Card placeholder</div>
                <div className="rounded-xl border p-6">Card placeholder</div>
              </div>
            </section>
          ) : related.length > 0 ? (
            <section className="mt-8 rounded-2xl border bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Related speakers</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {related.map(s => (
                  <SpeakerCard key={s.id} speaker={{ ...s, name: s.fullName, spokenLanguages: s.languages, expertiseAreas: s.expertise }} variant="compact" />
                ))}
              </div>
            </section>
          ) : null}
        </main>
      </div>

    </div>
  )
}
