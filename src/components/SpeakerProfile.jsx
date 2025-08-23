import React, { useMemo, useEffect, useState } from 'react';
import SpeakerCard from './SpeakerCard';
import { listSpeakersAll } from '@/lib/airtable';
import { getAllPublishedSpeakersCached, computeRelatedSpeakers } from '@/lib/speakers';
import VideoEmbed from './VideoEmbed';

function Chip({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border px-2.5 py-1 text-sm text-gray-700 bg-white shadow-sm">
      {children}
    </span>
  );
}

const parseTopics = (raw) => {
  if (!raw || typeof raw !== 'string') return [];
  return raw
    .split(/[\n;]+/)
    .map((s) => s.trim())
    .filter(Boolean);
};

const Card = ({ className = '', children }) => (
  <section className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>
    {children}
  </section>
);

const SectionTitle = ({ children }) => (
  <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{children}</h2>
);

export default function SpeakerProfile({ id, speakers = [] }) {
  useEffect(() => {
    setTimeout(() => window.scrollTo({ top: 0, left: 0, behavior: 'auto' }), 0);
  }, []);

  const speaker = useMemo(() => {
    if (!id) return null;
    const needle = decodeURIComponent(id).toLowerCase();
    return (
      speakers.find(
        (s) =>
          String(s.id || '').toLowerCase() === needle ||
          String(s.slug || '').toLowerCase() === needle
      ) || null
    );
  }, [id, speakers]);

  const [related, setRelated] = useState(null);

  const currentSpeaker = useMemo(() => {
    if (!speaker)
      return { id: '', slug: '', country: '', languages: [], expertise: [], featured: false };
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
    if (!currentSpeaker.id) return;
    let alive = true;
    (async () => {
      try {
        const all = await getAllPublishedSpeakersCached(listSpeakersAll);
        const picks = computeRelatedSpeakers(currentSpeaker, all, 3);
        if (alive) setRelated(picks);
      } catch (e) {
        console.error('Related speakers failed:', e);
        if (alive) setRelated([]);
      }
    })();
    return () => {
      alive = false;
    };
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
            onClick={(e) => {
              e.preventDefault();
              window.history.pushState({}, '', '#/find-speakers');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
          >
            Return to Find Speakers
          </a>
          .
        </p>
      </main>
    );
  }

  const fullName = [speaker.titlePrefix, speaker.firstName, speaker.lastName].filter(Boolean).join(' ');
  const videos = speaker.videos || [];
  const topics = Array.isArray(speaker.speakingTopics)
    ? speaker.speakingTopics.filter(Boolean)
    : parseTopics(speaker.speakingTopics);

  const shareUrl = `${window.location.origin}/#/speaker/${encodeURIComponent(
    (speaker.slug || speaker.id || '').toLowerCase()
  )}`;

  const onShare = async () => {
    try {
      const shareData = {
        title: `${fullName || speaker.title || 'ASB Speaker'}`,
        text: 'Check out this speaker from African Speaker Bureau',
        url: shareUrl,
      };
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        alert('Profile link copied to clipboard.');
      } else {
        prompt('Copy this link:', shareUrl);
      }
    } catch (e) {
      console.error('Share failed:', e);
    }
  };

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
            <div className="w-32 h-32 rounded-2xl bg-gray-100 grid place-content-center text-gray-400 text-sm">
              No image
            </div>
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

      {/* FIRST ROW */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* LEFT: What You’ll Get */}
        <Card className="md:col-span-2 p-6 mt-6 md:mt-8">
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
            {speaker.addresses && (
              <div>
                <h3 className="font-semibold">What the speeches will address</h3>
                <p className="mt-1">{speaker.addresses}</p>
              </div>
            )}
            {speaker.willLearn && (
              <div>
                <h3 className="font-semibold">What participants will learn</h3>
                <p className="mt-1">{speaker.willLearn}</p>
              </div>
            )}
            {speaker.takeHome && (
              <div>
                <h3 className="font-semibold">What the audience will take home</h3>
                <p className="mt-1">{speaker.takeHome}</p>
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

        {/* RIGHT: Quick facts */}
        <Card className="p-6 mt-6 md:mt-8">
          <SectionTitle>Quick facts</SectionTitle>
          <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
            <dt className="text-slate-500">Country</dt>
            <dd className="text-slate-900">{speaker.country || '—'}</dd>
            <dt className="text-slate-500">Languages</dt>
            <dd className="text-slate-900">
              {Array.isArray(speaker.languages) ? speaker.languages.join(', ') : speaker.languages || '—'}
            </dd>
            <dt className="text-slate-500">Availability</dt>
            <dd className="text-slate-900">{speaker.availability || '—'}</dd>
            <dt className="text-slate-500">Fee range</dt>
            <dd className="text-slate-900">{speaker.feeRange || 'On request'}</dd>
          </dl>
        </Card>
      </div>

      {/* Expertise areas under Quick facts on desktop */}
      <div className="grid gap-6 md:grid-cols-3 mt-6">
        <div className="md:col-start-3">
          <Card className="p-6">
            <SectionTitle>Expertise areas</SectionTitle>
            <div className="mt-4 flex flex-wrap gap-2">
              {(speaker.expertiseAreas || []).map((tag, i) => (
                <span
                  key={i}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Speaking Topics */}
      {topics.length > 0 && (
        <Card className="p-6 mt-6">
          <SectionTitle>Speaking Topics</SectionTitle>
          <ul className="mt-4 list-disc space-y-2 pl-6">
            {topics.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </Card>
      )}

      {/* About */}
      {(speaker.bio || speaker.achievements || speaker.education) && (
        <Card className="p-6 mt-6">
          <SectionTitle>About</SectionTitle>
          <div className="mt-4 space-y-6">
            {speaker.bio && (
              <div>
                <h3 className="font-semibold">Professional Bio</h3>
                <p className="mt-1">{speaker.bio}</p>
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

      {/* Track Record */}
      {(speaker.notableAchievements || speaker.achievements) && (
        <Card className="p-6 mt-6">
          <SectionTitle>Track Record</SectionTitle>
          <div className="mt-4 space-y-6">
            {speaker.notableAchievements && (
              <div>
                <h3 className="font-semibold">Notable Achievements</h3>
                <p className="mt-1">{speaker.notableAchievements}</p>
              </div>
            )}
            {speaker.achievements && (
              <div>
                <h3 className="font-semibold">Further achievements</h3>
                <p className="mt-1">{speaker.achievements}</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Videos */}
      {videos.length > 0 && (
        <section id="videos" className="mt-6">
          <SectionTitle>Videos</SectionTitle>
          <div className="video-grid mt-4">
            {videos.map((url, i) => (
              <VideoEmbed key={i} url={url} title={`Video ${i + 1} — ${fullName}`} />
            ))}
          </div>
        </section>
      )}

      {/* Related speakers */}
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
  );
}
