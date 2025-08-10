import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // adapt if not using RR
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getSpeakerById } from '../lib/airtable';

function Chip({ children }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 border text-sm text-gray-700">
      {children}
    </span>
  );
}

function SectionCard({ title, children }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm ring-1 ring-black/5">
      {title && <h2 className="text-lg font-semibold mb-3">{title}</h2>}
      {children}
    </div>
  );
}

function MediaGrid({ links = [] }) {
  if (!links.length) return null;

  const toEmbed = (url) => {
    try {
      const u = new URL(url);
      if (u.hostname.includes('youtube.com') || u.hostname.includes('youtu.be')) {
        const id = u.searchParams.get('v') || u.pathname.split('/').pop();
        return `https://www.youtube.com/embed/${id}`;
      }
      if (u.hostname.includes('vimeo.com')) {
        const id = u.pathname.split('/').filter(Boolean).pop();
        return `https://player.vimeo.com/video/${id}`;
      }
    } catch {
      /* ignore */
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {links.slice(0, 3).map((url, i) => {
        const embed = toEmbed(url);
        return (
          <div key={i} className="bg-white rounded-2xl p-4 shadow-sm ring-1 ring-black/5">
            {embed ? (
              <div className="aspect-video rounded-xl overflow-hidden">
                <iframe
                  src={embed}
                  title={`Video ${i + 1}`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ) : (
              <a href={url} target="_blank" rel="noopener" className="block rounded-xl border p-4 hover:bg-gray-50">
                Open link ↗
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function SpeakerProfile() {
  const { id } = useParams();
  const [speaker, setSpeaker] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const s = await getSpeakerById(id);
        if (alive) setSpeaker(s);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [id]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="max-w-6xl mx-auto px-4 py-16"><p>Loading…</p></main>
        <Footer />
      </>
    );
  }
  if (!speaker) {
    return (
      <>
        <Header />
        <main className="max-w-6xl mx-auto px-4 py-16"><p>Speaker not found.</p></main>
        <Footer />
      </>
    );
  }

  const s = speaker;
  const feeText = s.displayFee ? (s.feeRange || 'On request') : 'On request';

  return (
    <>
      <Header />

      {/* Hero with header image (dimmed) */}
      <section className="bg-slate-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="relative">
            <div className="aspect-[5/2] w-full overflow-hidden rounded-b-2xl">
              {s.headerImage?.url ? (
                <img
                  src={s.headerImage.url}
                  alt=""
                  className="w-full h-full object-cover opacity-70"
                />
              ) : (
                <div className="w-full h-full bg-slate-800" />
              )}
            </div>
            <div className="-mt-16 md:-mt-20 pb-6 md:pb-10" />
          </div>
        </div>
      </section>

      {/* Identity block */}
      <main className="max-w-6xl mx-auto px-4 -mt-24 md:-mt-28">
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 p-6 md:p-8">
          <div className="grid md:grid-cols-[220px,1fr] gap-6 items-start">
            <div className="flex justify-center md:justify-start">
              <img
                src={s.profileImage?.url}
                alt={s.fullName}
                className="w-[200px] h-[200px] rounded-2xl object-cover ring-1 ring-black/5"
              />
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">{s.fullName}</h1>
              {s.professionalTitle && (
                <p className="text-gray-700 text-lg">{s.professionalTitle}</p>
              )}

              {/* Bubbles: Languages → Country → Travel → Fee */}
              <div className="flex flex-wrap gap-2 pt-1">
                {s.spokenLanguages?.length ? <Chip>🗣️ {s.spokenLanguages.join(', ')}</Chip> : null}
                {s.country ? <Chip>🌍 {s.country}</Chip> : null}
                {s.travel ? <Chip>✈️ {s.travel}</Chip> : null}
                <Chip>💼 {feeText}</Chip>
              </div>

              <div className="flex gap-3 pt-3">
                <a href="/#book" className="px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700">
                  Contact {s.firstName || 'Speaker'}
                </a>
                <button
                  onClick={() =>
                    navigator.share?.({ title: s.fullName, url: window.location.href }) ??
                    window.alert('Copy link:\n' + window.location.href)
                  }
                  className="px-4 py-2 rounded-xl border hover:bg-gray-50"
                >
                  Share profile
                </button>
                <a href="/find" className="px-4 py-2 rounded-xl border hover:bg-gray-50">← Back to search</a>
              </div>
            </div>
          </div>
        </div>

        {/* Content grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {/* Left column */}
          <div className="md:col-span-2 space-y-6">
            <SectionCard title="Key Messages">
              {s.keyMessages ? (
                <p className="leading-7 text-gray-800 whitespace-pre-line">{s.keyMessages}</p>
              ) : <p className="text-gray-500">—</p>}
            </SectionCard>

            <SectionCard title="About">
              <div className="space-y-5">
                {s.professionalBio && (
                  <div>
                    <h3 className="font-medium mb-1">Professional Bio</h3>
                    <p className="leading-7 text-gray-800 whitespace-pre-line">{s.professionalBio}</p>
                  </div>
                )}
                {s.achievements && (
                  <div>
                    <h3 className="font-medium mb-1">Achievements</h3>
                    <p className="leading-7 text-gray-800 whitespace-pre-line">{s.achievements}</p>
                  </div>
                )}
                {s.education && (
                  <div>
                    <h3 className="font-medium mb-1">Education</h3>
                    <p className="leading-7 text-gray-800 whitespace-pre-line">{s.education}</p>
                  </div>
                )}
              </div>
            </SectionCard>

            <SectionCard title="Speaking Topics">
              {s.speakingTopics?.length ? (
                <ul className="list-disc pl-6 space-y-2 text-gray-800">
                  {s.speakingTopics.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              ) : <p className="text-gray-500">—</p>}
            </SectionCard>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <SectionCard title="Quick facts">
              <dl className="text-sm text-gray-700 grid gap-2">
                {s.country && <div className="flex justify-between"><dt>Country</dt><dd className="font-medium">{s.country}</dd></div>}
                {s.location && <div className="flex justify-between"><dt>Location</dt><dd className="font-medium">{s.location}</dd></div>}
                {s.spokenLanguages?.length ? <div className="flex justify-between"><dt>Languages</dt><dd className="font-medium">{s.spokenLanguages.join(', ')}</dd></div> : null}
                {s.travel && <div className="flex justify-between"><dt>Availability</dt><dd className="font-medium">{s.travel}</dd></div>}
                <div className="flex justify-between"><dt>Fee range</dt><dd className="font-medium">{feeText}</dd></div>
              </dl>
            </SectionCard>

            <SectionCard title="Expertise Areas">
              {s.expertiseAreas?.length ? (
                <div className="flex flex-wrap gap-2">
                  {s.expertiseAreas.map(x => (
                    <span key={x} className="px-3 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-200 text-sm">{x}</span>
                  ))}
                </div>
              ) : <p className="text-gray-500">—</p>}
            </SectionCard>
          </div>
        </div>

        {/* Media */}
        <div className="mt-6">
          <SectionCard title="Videos & Articles">
            <MediaGrid links={s.videoLinks} />
          </SectionCard>
        </div>

        {/* Why booking … */}
        {(s.deliveryStyle || s.whyListen || s.whatAddress || s.whatLearn || s.whatTakeHome || s.benefitsIndividual || s.benefitsOrganisation) && (
          <div className="mt-6">
            <SectionCard title={`Why booking ${s.firstName || ''} ${s.lastName || ''}`.trim()}>
              <div className="space-y-4 text-gray-800">
                {s.whyListen && <div><h3 className="font-medium mb-1">Why the audience should listen</h3><p className="whitespace-pre-line">{s.whyListen}</p></div>}
                {s.whatAddress && <div><h3 className="font-medium mb-1">What the speeches will address</h3><p className="whitespace-pre-line">{s.whatAddress}</p></div>}
                {s.whatLearn && <div><h3 className="font-medium mb-1">What participants will learn</h3><p className="whitespace-pre-line">{s.whatLearn}</p></div>}
                {s.whatTakeHome && <div><h3 className="font-medium mb-1">What the audience will take home</h3><p className="whitespace-pre-line">{s.whatTakeHome}</p></div>}
                {s.benefitsIndividual && <div><h3 className="font-medium mb-1">Benefits for the individual</h3><p className="whitespace-pre-line">{s.benefitsIndividual}</p></div>}
                {s.benefitsOrganisation && <div><h3 className="font-medium mb-1">Benefits for the organisation</h3><p className="whitespace-pre-line">{s.benefitsOrganisation}</p></div>}
                {s.deliveryStyle && <div><h3 className="font-medium mb-1">Speaker’s delivery style</h3><p className="whitespace-pre-line">{s.deliveryStyle}</p></div>}
              </div>
            </SectionCard>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
