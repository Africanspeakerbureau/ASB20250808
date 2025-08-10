import React, { useMemo } from 'react'

const placeholderAvatar = 'https://via.placeholder.com/160?text=ASB'

function asList(str) {
  if (!str) return []
  return String(str)
    .split(/\r?\n|;|•/g)
    .map(s => s.trim())
    .filter(Boolean)
}

function chip(text) {
  return (
    <span key={text} className="inline-flex items-center rounded-full border px-2.5 py-1 text-sm text-gray-700 bg-white shadow-sm">
      {text}
    </span>
  )
}

export default function SpeakerProfile({ id, speakers = [] }) {
  const speaker = useMemo(() => {
    if (!id) return null
    const needle = decodeURIComponent(id).toLowerCase()
    return speakers.find(s =>
      String(s.id || '').toLowerCase() === needle ||
      String(s.slug || '').toLowerCase() === needle
    ) || null
  }, [id, speakers])

  if (!speaker) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="text-xl font-semibold mb-2">Speaker not found</h1>
        <p className="text-gray-600">
          We couldn’t locate that profile.{' '}
          <a
            className="text-blue-600 underline"
            href="/find"
            onClick={(e)=>{e.preventDefault(); window.history.pushState({}, '', '/find'); window.dispatchEvent(new PopStateEvent('popstate'));}}
          >
            Return to Find Speakers
          </a>.
        </p>
      </main>
    )
  }

  const titlePrefix = speaker.title || ''
  const first = speaker.firstName || ''
  const last = speaker.lastName || ''
  const professionalTitle = speaker.professionalTitle || speaker.expertiseAreasSubtitle || ''
  const headerImage = (speaker.headerImage && speaker.headerImage[0]?.url) || ''
  const avatar = (speaker.profileImage && speaker.profileImage[0]?.url) || speaker.photoUrl || placeholderAvatar

  const country = speaker.country || ''
  const location = speaker.location || ''
  const languages = speaker.spokenLanguages || speaker.languages || []
  const travel = speaker.travelWillingness || speaker.availability || ''
  const fee = speaker.feeRange || ''
  const displayFee = (speaker.displayFee || '').toLowerCase() === 'yes'

  const keyMessages = speaker.keyMessages || ''
  const bio = speaker.professionalBio || speaker.bio || ''
  const achievements = speaker.achievements || ''
  const education = speaker.education || ''

  const topics = asList(speaker.speakingTopics)

  const expertiseAreas = Array.isArray(speaker.expertiseAreas)
    ? speaker.expertiseAreas
    : asList(speaker.expertiseAreas)

  const videoLinks = [speaker.videoLink1, speaker.videoLink2, speaker.videoLink3].filter(Boolean)

  const whyListen = speaker.whyTheAudienceShouldListenToTheseTopics || ''
  const whatAddress = speaker.whatTheSpeechesWillAddress || ''
  const whatLearn = speaker.whatParticipantsWillLearn || ''
  const whatTakeHome = speaker.whatTheAudienceWillTakeHome || ''
  const benefitsIndividual = speaker.benefitsForTheIndividual || ''
  const benefitsOrg = speaker.benefitsForTheOrganisation || ''
  const deliveryStyle = speaker.speakersDeliveryStyle || ''

  const related = (expertiseAreas.length && speakers.length)
    ? speakers
        .filter(s => s.id !== speaker.id)
        .map(s => {
          const sAreas = Array.isArray(s.expertiseAreas) ? s.expertiseAreas : asList(s.expertiseAreas)
          const mine = new Set(expertiseAreas.map(e => e.toLowerCase()))
          const score = sAreas.reduce((acc, a) => acc + (mine.has(String(a).toLowerCase()) ? 1 : 0), 0)
          return { s, score }
        })
        .filter(x => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map(x => x.s)
    : []

  const displayFeeText = displayFee ? fee || 'On request' : 'On request'

  return (
    <main className="mx-auto max-w-6xl px-4 pb-24">
      {headerImage ? (
        <div className="h-40 md:h-56 w-full overflow-hidden rounded-b-2xl mb-6">
          <img src={headerImage} alt="" className="h-full w-full object-cover" />
        </div>
      ) : (
        <div className="h-10" />
      )}

      <section className="bg-white rounded-2xl shadow-sm border p-5 md:p-6 -mt-10 md:-mt-16">
        <div className="flex flex-col md:flex-row gap-5 md:gap-6">
          <img
            src={avatar}
            alt={`${first} ${last}`}
            className="h-28 w-28 md:h-36 md:w-36 rounded-2xl object-cover border"
          />
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-semibold">
              {titlePrefix ? `${titlePrefix} ` : ''}{first} {last}
            </h1>
            {professionalTitle ? (
              <p className="mt-1 text-gray-600">{professionalTitle}</p>
            ) : null}

            <div className="flex flex-wrap gap-2 mt-4">
              {Array.isArray(languages) ? languages.map(l => chip(l)) : languages ? chip(languages) : null}
              {country ? chip(country) : null}
              {travel ? chip(travel) : null}
              {displayFeeText ? chip(`USD ${displayFeeText}`.replace(/^USD\sOn request$/, 'On request')) : null}
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="#book"
                onClick={(e)=>{e.preventDefault(); const anchor=document.getElementById('book'); if(anchor) anchor.scrollIntoView({behavior:'smooth'});}}
                className="inline-flex items-center rounded-xl bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700"
              >
                Contact {first}
              </a>
              <button
                type="button"
                className="inline-flex items-center rounded-xl border px-4 py-2 text-gray-800 bg-white shadow-sm"
                onClick={()=>{navigator.clipboard?.writeText(window.location.href);}}
              >
                Share profile
              </button>
              <a
                href="/find"
                onClick={(e)=>{e.preventDefault(); window.history.pushState({}, '', '/find'); window.dispatchEvent(new PopStateEvent('popstate'));}}
                className="inline-flex items-center rounded-xl border px-4 py-2 text-gray-800 bg-white shadow-sm"
              >
                Back to search
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {keyMessages ? (
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold mb-2">Key Messages</h2>
              <p className="text-gray-700 whitespace-pre-line">{keyMessages}</p>
            </div>
          ) : null}

          {(bio || achievements || education) ? (
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold mb-3">About</h2>

              {bio ? (
                <>
                  <h3 className="font-medium text-gray-900">Professional Bio</h3>
                  <p className="text-gray-700 whitespace-pre-line mb-4">{bio}</p>
                </>
              ) : null}

              {achievements ? (
                <>
                  <h3 className="font-medium text-gray-900">Achievements</h3>
                  <p className="text-gray-700 whitespace-pre-line mb-4">{achievements}</p>
                </>
              ) : null}

              {education ? (
                <>
                  <h3 className="font-medium text-gray-900">Education</h3>
                  <p className="text-gray-700 whitespace-pre-line">{education}</p>
                </>
              ) : null}
            </div>
          ) : null}

          {topics.length ? (
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold mb-3">Speaking Topics</h2>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                {topics.map((t,i)=>(<li key={i}>{t}</li>))}
              </ul>
            </div>
          ) : null}

          {(videoLinks.length) ? (
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold mb-3">Videos & Articles</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {videoLinks.map((url, i)=>(
                  <a key={i} href={url} target="_blank" rel="noreferrer" className="block rounded-xl border p-3 hover:shadow">
                    <div className="aspect-video w-full rounded-lg bg-gray-100 grid place-content-center">
                      <span className="text-sm text-gray-500">Open link</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ) : null}

          {(whyListen || whatAddress || whatLearn || whatTakeHome || benefitsIndividual || benefitsOrg || deliveryStyle) ? (
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Why booking {first} {last}</h2>

              {whyListen ? (
                <>
                  <h3 className="font-medium text-gray-900">Why the audience should listen</h3>
                  <p className="text-gray-700 whitespace-pre-line mb-4">{whyListen}</p>
                </>
              ) : null}

              {whatAddress ? (
                <>
                  <h3 className="font-medium text-gray-900">What the speeches will address</h3>
                  <p className="text-gray-700 whitespace-pre-line mb-4">{whatAddress}</p>
                </>
              ) : null}

              {whatLearn ? (
                <>
                  <h3 className="font-medium text-gray-900">What participants will learn</h3>
                  <p className="text-gray-700 whitespace-pre-line mb-4">{whatLearn}</p>
                </>
              ) : null}

              {whatTakeHome ? (
                <>
                  <h3 className="font-medium text-gray-900">What the audience will take home</h3>
                  <p className="text-gray-700 whitespace-pre-line mb-4">{whatTakeHome}</p>
                </>
              ) : null}

              {benefitsIndividual ? (
                <>
                  <h3 className="font-medium text-gray-900">Benefits for the individual</h3>
                  <p className="text-gray-700 whitespace-pre-line mb-4">{benefitsIndividual}</p>
                </>
              ) : null}

              {benefitsOrg ? (
                <>
                  <h3 className="font-medium text-gray-900">Benefits for the organisation</h3>
                  <p className="text-gray-700 whitespace-pre-line mb-4">{benefitsOrg}</p>
                </>
              ) : null}

              {deliveryStyle ? (
                <>
                  <h3 className="font-medium text-gray-900">Speaker’s delivery style</h3>
                  <p className="text-gray-700 whitespace-pre-line">{deliveryStyle}</p>
                </>
              ) : null}
            </div>
          ) : null}
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold mb-3">Quick facts</h2>
            <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
              <dt className="text-gray-500">Country</dt><dd>{country || '—'}</dd>
              {location ? (<><dt className="text-gray-500">Location</dt><dd>{location}</dd></>) : null}
              <dt className="text-gray-500">Languages</dt><dd>{Array.isArray(languages)? languages.join(', ') : (languages || '—')}</dd>
              <dt className="text-gray-500">Availability</dt><dd>{travel || '—'}</dd>
              <dt className="text-gray-500">Fee range</dt><dd>{displayFeeText || 'On request'}</dd>
            </dl>
          </div>

          {expertiseAreas.length ? (
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold mb-3">Expertise Areas</h2>
              <div className="flex flex-wrap gap-2">
                {expertiseAreas.map(a => (
                  <span key={a} className="inline-flex items-center rounded-full bg-violet-50 text-violet-800 px-3 py-1 text-sm border border-violet-200">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </aside>
      </section>

      <section className="mt-8 rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Related speakers</h2>
        {related.length ? (
          <div className="grid md:grid-cols-3 gap-4">
            {related.map(r => {
              const path = `/speaker/${encodeURIComponent(r.id || r.slug)}`
              const avatarR = (r.profileImage && r.profileImage[0]?.url) || r.photoUrl || placeholderAvatar
              return (
                <a key={r.id} href={path}
                   onClick={(e)=>{e.preventDefault(); window.history.pushState({}, '', path); window.dispatchEvent(new PopStateEvent('popstate'));}}
                   className="rounded-xl border p-4 hover:shadow flex items-center gap-3">
                  <img src={avatarR} alt="" className="h-14 w-14 rounded-xl object-cover border" />
                  <div>
                    <div className="font-medium">{r.firstName} {r.lastName}</div>
                    <div className="text-sm text-gray-600 truncate">{r.professionalTitle || ''}</div>
                  </div>
                </a>
              )
            })}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4 opacity-60">
            <div className="rounded-xl border p-6">Card placeholder</div>
            <div className="rounded-xl border p-6">Card placeholder</div>
            <div className="rounded-xl border p-6">Card placeholder</div>
          </div>
        )}
      </section>

      <div id="book" className="pt-24" />
    </main>
  )
}

