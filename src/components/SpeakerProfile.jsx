import React, { useMemo, useEffect } from 'react'

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

function videoEmbed(url = '') {
  if (/youtu\.be\//.test(url)) {
    const id = url.split('/').pop().split('?')[0]
    return `https://www.youtube.com/embed/${id}`
  }
  if (/youtube\.com/.test(url)) {
    const match = url.match(/[?&]v=([^&]+)/)
    if (match && match[1]) return `https://www.youtube.com/embed/${match[1]}`
  }
  if (/vimeo\.com/.test(url)) {
    const id = url.split('/').pop().split('?')[0]
    return `https://player.vimeo.com/video/${id}`
  }
  return ''
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

  return (
    <main className="mx-auto max-w-6xl px-4 pb-24">
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

            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="#/book-a-speaker"
                className="inline-flex items-center rounded-xl bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700"
              >
                Contact {speaker.firstName}
              </a>
              <button
                type="button"
                className="inline-flex items-center rounded-xl border px-4 py-2 text-gray-800 bg-white shadow-sm"
                onClick={()=>{navigator.clipboard?.writeText(window.location.href);}}
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

      <section className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
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

          {videos.length > 0 && (
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold mb-3">Videos & Articles</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {videos.slice(0,3).map((url, i) => {
                  const embed = videoEmbed(url)
                  return embed ? (
                    <div key={i} className="aspect-video w-full rounded-lg overflow-hidden">
                      <iframe
                        src={embed}
                        title={`video-${i}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </div>
                  ) : (
                    <a key={i} href={url} target="_blank" rel="noreferrer" className="block rounded-xl border p-3 hover:shadow">
                      <div className="aspect-video w-full rounded-lg bg-gray-100 grid place-content-center">
                        <span className="text-sm text-gray-500">Open link</span>
                      </div>
                    </a>
                  )
                })}
              </div>
            </div>
          )}

          {(speaker.whyListen || speaker.whatAddress || speaker.whatLearn || speaker.whatTakeHome || speaker.benefitsIndividual || speaker.benefitsOrganisation || speaker.deliveryStyle) && (
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Why booking {speaker.firstName} {speaker.lastName}</h2>
              {speaker.whyListen && (
                <>
                  <h3 className="font-medium text-gray-900">Why the audience should listen</h3>
                  <p className="text-gray-700 whitespace-pre-line mb-4">{speaker.whyListen}</p>
                </>
              )}
              {speaker.whatAddress && (
                <>
                  <h3 className="font-medium text-gray-900">What the speeches will address</h3>
                  <p className="text-gray-700 whitespace-pre-line mb-4">{speaker.whatAddress}</p>
                </>
              )}
              {speaker.whatLearn && (
                <>
                  <h3 className="font-medium text-gray-900">What participants will learn</h3>
                  <p className="text-gray-700 whitespace-pre-line mb-4">{speaker.whatLearn}</p>
                </>
              )}
              {speaker.whatTakeHome && (
                <>
                  <h3 className="font-medium text-gray-900">What the audience will take home</h3>
                  <p className="text-gray-700 whitespace-pre-line mb-4">{speaker.whatTakeHome}</p>
                </>
              )}
              {speaker.benefitsIndividual && (
                <>
                  <h3 className="font-medium text-gray-900">Benefits for the individual</h3>
                  <p className="text-gray-700 whitespace-pre-line mb-4">{speaker.benefitsIndividual}</p>
                </>
              )}
              {speaker.benefitsOrganisation && (
                <>
                  <h3 className="font-medium text-gray-900">Benefits for the organisation</h3>
                  <p className="text-gray-700 whitespace-pre-line mb-4">{speaker.benefitsOrganisation}</p>
                </>
              )}
              {speaker.deliveryStyle && (
                <>
                  <h3 className="font-medium text-gray-900">Speaker’s delivery style</h3>
                  <p className="text-gray-700 whitespace-pre-line">{speaker.deliveryStyle}</p>
                </>
              )}
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold mb-3">Quick facts</h2>
            <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
              <dt className="text-gray-500">Country</dt><dd>{speaker.country || '—'}</dd>
              <dt className="text-gray-500">Languages</dt><dd>{speaker.languages?.join(', ') || '—'}</dd>
              <dt className="text-gray-500">Availability</dt><dd>{speaker.travelWillingness || '—'}</dd>
              <dt className="text-gray-500">Fee range</dt><dd>{speaker.feeRange || 'On request'}</dd>
            </dl>
          </div>

          {speaker.expertiseAreas?.length > 0 && (
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold mb-3">Expertise Areas</h2>
              <div className="flex flex-wrap gap-2">
                {speaker.expertiseAreas.map(a => (
                  <span key={a} className="inline-flex items-center rounded-full bg-violet-50 text-violet-800 px-3 py-1 text-sm border border-violet-200">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}
        </aside>
      </section>

      <section className="mt-8 rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Related speakers</h2>
        <div className="grid md:grid-cols-3 gap-4 opacity-60">
          <div className="rounded-xl border p-6">Card placeholder</div>
          <div className="rounded-xl border p-6">Card placeholder</div>
          <div className="rounded-xl border p-6">Card placeholder</div>
        </div>
      </section>
    </main>
  )
}
