import React, { useMemo, useEffect, useState } from 'react';
import SpeakerCard from './SpeakerCard';
import { listSpeakersAll } from '@/lib/airtable';
import { getAllPublishedSpeakersCached, computeRelatedSpeakers } from '@/lib/speakers';
import VideoEmbed from './VideoEmbed';
import '../styles/speaker-profile.css';

function Chip({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border px-2.5 py-1 text-sm text-gray-700 bg-white shadow-sm">
      {children}
    </span>
  )
}

const parseTopics = (raw) => {
  if (!raw || typeof raw !== 'string') return [];
  return raw
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean);
};


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

              <div className="profile-actions">
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
                  onClick={(e) => {
                    e.preventDefault();
                    window.history.pushState({}, '', '#/find-speakers');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }}
                  className="inline-flex items-center rounded-xl border px-4 py-2 text-gray-800 bg-white shadow-sm"
                >
                  Back to search
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-columns">
          <div className="profile-main">
            <div className="card">
              <h2>What You’ll Get</h2>
              {speaker.keyMessages && (
                <>
                  <h4>Key Messages</h4>
                  <p>{speaker.keyMessages}</p>
                </>
              )}
              {speaker.deliveryStyle && (
                <>
                  <h4>Delivery Style</h4>
                  <p>{speaker.deliveryStyle}</p>
                </>
              )}
              {speaker.whyThisSpeaker && (
                <>
                  <h4>Why This Speaker</h4>
                  <p>{speaker.whyThisSpeaker}</p>
                </>
              )}
              {speaker.addresses && (
                <>
                  <h4>What the speeches will address</h4>
                  <p>{speaker.addresses}</p>
                </>
              )}
              {speaker.willLearn && (
                <>
                  <h4>What participants will learn</h4>
                  <p>{speaker.willLearn}</p>
                </>
              )}
              {speaker.takeHome && (
                <>
                  <h4>What the audience will take home</h4>
                  <p>{speaker.takeHome}</p>
                </>
              )}
              {(speaker.benefitsIndividual || speaker.benefitsOrganisation) && (
                <>
                  {speaker.benefitsIndividual && (
                    <>
                      <h4>Benefits: Individual</h4>
                      <p>{speaker.benefitsIndividual}</p>
                    </>
                  )}
                  {speaker.benefitsOrganisation && (
                    <>
                      <h4>Benefits: Organisation</h4>
                      <p>{speaker.benefitsOrganisation}</p>
                    </>
                  )}
                </>
              )}
            </div>

            {parseTopics(speaker.speakingTopics).length > 0 && (
              <div className="card">
                <h2>Speaking Topics</h2>
                <ul>
                  {parseTopics(speaker.speakingTopics).map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>
            )}

            {(speaker.bio || speaker.achievements || speaker.education) && (
              <div className="card">
                <h2>About</h2>
                {speaker.bio && (
                  <>
                    <h4>Professional Bio</h4>
                    <p>{speaker.bio}</p>
                  </>
                )}
                {speaker.achievements && (
                  <>
                    <h4>Further achievements</h4>
                    <p>{speaker.achievements}</p>
                  </>
                )}
                {speaker.education && (
                  <>
                    <h4>Education</h4>
                    <p>{speaker.education}</p>
                  </>
                )}
              </div>
            )}

            {speaker.notableAchievements && (
              <div className="card">
                <h2>Track Record</h2>
                <h4>Notable Achievements</h4>
                <p>{speaker.notableAchievements}</p>
              </div>
            )}

            {videos.length > 0 && (
              <section id="videos">
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
                  {related.map((s) => (
                    <SpeakerCard
                      key={s.id}
                      speaker={{ ...s, name: s.fullName, spokenLanguages: s.languages, expertiseAreas: s.expertise }}
                      variant="compact"
                    />
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          <aside className="profile-aside">
            <div className="card">
              <h2>Quick facts</h2>
              <dl>
                <dt>Country</dt>
                <dd>{speaker.country || '—'}</dd>
                <dt>Languages</dt>
                <dd>
                  {Array.isArray(speaker.languages)
                    ? speaker.languages.join(' | ')
                    : speaker.languages || '—'}
                </dd>
                <dt>Availability</dt>
                <dd>{speaker.availability || '—'}</dd>
                <dt>Fee range</dt>
                <dd>{speaker.feeRange || 'On request'}</dd>
              </dl>
            </div>

            {Array.isArray(speaker.expertiseAreas) && speaker.expertiseAreas.length > 0 && (
              <div className="card">
                <h2>Expertise areas</h2>
                <div className="tags">
                  {speaker.expertiseAreas.map((tag, i) => (
                    <span key={i} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    );
  }
