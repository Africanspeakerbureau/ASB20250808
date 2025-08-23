import React, { useMemo, useEffect, useState } from 'react';
import SpeakerCard from './SpeakerCard';
import { listSpeakersAll } from '@/lib/airtable';
import { getAllPublishedSpeakersCached, computeRelatedSpeakers } from '@/lib/speakers';
import VideoEmbed from './VideoEmbed';
import QuickFacts from './QuickFacts';
import WhatYoullGetCard from './profile/WhatYoullGetCard';

function asList(str) {
  if (!str) return []
  return String(str)
    .split(/\r?\n|;|•/g)
    .map(s => s.trim())
    .filter(Boolean)
}

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
  const topics = asList(speaker.topics || speaker.speakingTopics)
  const hasBulletTopics = topics.length > 1
  const videos = speaker.videos || []
  const expertiseAreas = Array.isArray(speaker.expertiseAreas)
    ? speaker.expertiseAreas
    : Array.isArray(speaker.fields?.['Expertise Areas'])
    ? speaker.fields['Expertise Areas']
    : []

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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <aside className="lg:col-span-4 order-1 lg:order-2 lg:sticky lg:top-24">
          <section id="quick-facts" className="mt-4 lg:mt-0">
            <QuickFacts
              country={speaker.country}
              languages={speaker.languages}
              availability={speaker.travelWillingness}
              feeRange={speaker.feeRange}
            />
          </section>
          {expertiseAreas.length > 0 && (
            <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm mt-4">
              <h3 className="text-xl font-semibold">Expertise areas</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {expertiseAreas.map(tag => (
                  <span key={tag} className="inline-block rounded-full px-3 py-1 text-sm border">
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          )}
        </aside>
        <main className="lg:col-span-8 order-2 lg:order-1 space-y-6">
          {speaker.keyMessages && (
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold mb-2">Key Messages</h2>
              <p className="text-gray-700 whitespace-pre-line">{speaker.keyMessages}</p>
            </div>
          )}

          {(speaker.bio || speaker.achievements || speaker.education) && (
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold mb-3">About</h2>
              {speaker.bio && (
                <>
                  <h3 className="font-medium text-gray-900">Professional Bio</h3>
                  <p className="text-gray-700 whitespace-pre-line mb-4">{speaker.bio}</p>
                </>
              )}
              {speaker.achievements && (
                <>
                  <h3 className="font-medium text-gray-900">Achievements</h3>
                  <p className="text-gray-700 whitespace-pre-line mb-4">{speaker.achievements}</p>
                </>
              )}
              {speaker.education && (
                <>
                  <h3 className="font-medium text-gray-900">Education</h3>
                  <p className="text-gray-700 whitespace-pre-line">{speaker.education}</p>
                </>
              )}
            </div>
          )}

          {topics.length > 0 && (
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold mb-3">Speaking Topics</h2>
              {hasBulletTopics ? (
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  {topics.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-700">{topics[0]}</p>
              )}
            </div>
          )}

          <WhatYoullGetCard wyg={speaker.whatYoullGet} />

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
