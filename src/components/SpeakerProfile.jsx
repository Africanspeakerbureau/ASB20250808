import React from 'react'

function Chip({ children }) {
  if (!children) return null
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700">
      {children}
    </span>
  )
}

export default function SpeakerProfile({ speaker }) {
  if (!speaker) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="text-2xl font-semibold">Speaker not found</h1>
        <p className="mt-2 text-slate-600">Try going back to search.</p>
      </main>
    )
  }

  const titlePrefix = speaker.Title || speaker.title || ''
  const firstName = speaker['First Name'] || speaker.firstName || speaker.name?.split(' ')?.[0] || ''
  const lastName = speaker['Last Name'] || speaker.lastName || speaker.name?.split(' ')?.slice(1).join(' ') || ''
  const fullName = [titlePrefix, firstName, lastName].filter(Boolean).join(' ').trim()

  const profTitle = speaker['Professional Title'] || speaker.professionalTitle || speaker.subtitle || ''
  const languages = speaker['Spoken Languages'] || speaker.languages || []
  const country = speaker.Country || speaker.country || ''
  const city = speaker.Location || speaker.city || ''
  const travel = speaker['Travel Willingness'] || speaker.availability || ''
  const feeRange = speaker['Fee Range'] || speaker.feeRange || ''
  const displayFee = (speaker['Display Fee'] || speaker.displayFee || 'Yes').toString().toLowerCase()
  const feeLabel = displayFee === 'no' ? 'On request' : feeRange

  const expertise = speaker['Expertise Areas'] || speaker.expertise || []
  const topicsRaw = speaker['Speaking Topics'] || speaker.topics || ''
  const topics = Array.isArray(topicsRaw) ? topicsRaw : String(topicsRaw || '').split(/\n|,|;/).map(t => t.trim()).filter(Boolean)

  const keyMessages = speaker['Key Messages'] || speaker.keyMessages || ''
  const bio = speaker['Professional Bio'] || speaker.bio || ''
  const achievements = speaker['Achievements'] || speaker.achievements || ''
  const education = speaker['Education'] || speaker.education || ''

  const whyListen = speaker['Why the audience should listen to these topics'] || ''
  const willAddress = speaker['What the speeches will address'] || ''
  const willLearn = speaker['What participants will learn'] || ''
  const takeHome = speaker['What the audience will take home'] || ''
  const benefitsInd = speaker['Benefits for the individual'] || ''
  const benefitsOrg = speaker['Benefits for the organisation'] || ''
  const delivery = speaker['Speakers Delivery Style'] || speaker.deliveryStyle || ''

  const headerImg = speaker['Header Image'] && speaker['Header Image'][0]?.url
  const profileImg = (speaker['Profile Image'] && speaker['Profile Image'][0]?.url) || speaker.photo || ''

  return (
    <main className="bg-slate-50">
      {headerImg && (
        <div className="h-56 w-full bg-slate-900">
          <img src={headerImg} alt="" className="h-full w-full object-cover opacity-80" />
        </div>
      )}

      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
          <div className="px-6 pb-6 pt-8 sm:px-8 sm:pt-10">
            <div className="flex gap-6">
              {profileImg ? (
                <img
                  src={profileImg}
                  alt={fullName}
                  className="h-28 w-28 flex-none rounded-2xl object-cover ring-1 ring-slate-200"
                />
              ) : (
                <div className="h-28 w-28 flex-none rounded-2xl bg-slate-100" />
              )}

              <div className="min-w-0">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                  {fullName || speaker.name || 'Unnamed Speaker'}
                </h1>
                {profTitle && <p className="mt-1 text-slate-600">{profTitle}</p>}

                <div className="mt-4 flex flex-wrap gap-2">
                  <Chip>{Array.isArray(languages) ? languages.join(', ') : languages}</Chip>
                  <Chip>{country}</Chip>
                  <Chip>{travel}</Chip>
                  <Chip>{feeLabel}</Chip>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href="#book"
                    onClick={(e) => {
                      e.preventDefault()
                      const el = document.getElementById('book')
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }}
                    className="inline-flex items-center rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                  >
                    Contact {firstName || 'Speaker'}
                  </a>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard?.writeText(window.location.href)}
                    className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50"
                  >
                    Share profile
                  </button>
                  <a
                    href="/find"
                    className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50"
                  >
                    ← Back to search
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            {keyMessages && (
              <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                <h2 className="mb-3 text-lg font-semibold text-slate-900">Key Messages</h2>
                <p className="whitespace-pre-wrap text-slate-700">{keyMessages}</p>
              </section>
            )}

            {(bio || achievements || education) && (
              <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                <h2 className="mb-3 text-lg font-semibold text-slate-900">About</h2>
                {bio && (
                  <>
                    <h3 className="mt-2 text-sm font-semibold text-slate-900">Professional Bio</h3>
                    <p className="mt-1 whitespace-pre-wrap text-slate-700">{bio}</p>
                  </>
                )}
                {achievements && (
                  <>
                    <h3 className="mt-4 text-sm font-semibold text-slate-900">Achievements</h3>
                    <p className="mt-1 whitespace-pre-wrap text-slate-700">{achievements}</p>
                  </>
                )}
                {education && (
                  <>
                    <h3 className="mt-4 text-sm font-semibold text-slate-900">Education</h3>
                    <p className="mt-1 whitespace-pre-wrap text-slate-700">{education}</p>
                  </>
                )}
              </section>
            )}

            {topics.length > 0 && (
              <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                <h2 className="mb-3 text-lg font-semibold text-slate-900">Speaking Topics</h2>
                <ul className="list-disc space-y-1 pl-5 text-slate-700">
                  {topics.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </section>
            )}

            <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
              <h2 className="mb-3 text-lg font-semibold text-slate-900">Videos & Articles</h2>
              <div className="grid gap-4 md:grid-cols-3">
                {[0,1,2].map(i => (
                  <div key={i} className="h-40 rounded-xl border border-dashed border-slate-200 bg-slate-50" />
                ))}
              </div>
            </section>

            {(whyListen || willAddress || willLearn || takeHome || benefitsInd || benefitsOrg || delivery) && (
              <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                <h2 className="mb-3 text-lg font-semibold text-slate-900">
                  Why booking {firstName} {lastName}
                </h2>
                {whyListen && (
                  <>
                    <h3 className="mt-4 text-sm font-semibold text-slate-900">Why the audience should listen</h3>
                    <p className="mt-1 whitespace-pre-wrap text-slate-700">{whyListen}</p>
                  </>
                )}
                {willAddress && (
                  <>
                    <h3 className="mt-4 text-sm font-semibold text-slate-900">What the speeches will address</h3>
                    <p className="mt-1 whitespace-pre-wrap text-slate-700">{willAddress}</p>
                  </>
                )}
                {willLearn && (
                  <>
                    <h3 className="mt-4 text-sm font-semibold text-slate-900">What participants will learn</h3>
                    <p className="mt-1 whitespace-pre-wrap text-slate-700">{willLearn}</p>
                  </>
                )}
                {takeHome && (
                  <>
                    <h3 className="mt-4 text-sm font-semibold text-slate-900">What the audience will take home</h3>
                    <p className="mt-1 whitespace-pre-wrap text-slate-700">{takeHome}</p>
                  </>
                )}
                {benefitsInd && (
                  <>
                    <h3 className="mt-4 text-sm font-semibold text-slate-900">Benefits for the individual</h3>
                    <p className="mt-1 whitespace-pre-wrap text-slate-700">{benefitsInd}</p>
                  </>
                )}
                {benefitsOrg && (
                  <>
                    <h3 className="mt-4 text-sm font-semibold text-slate-900">Benefits for the organisation</h3>
                    <p className="mt-1 whitespace-pre-wrap text-slate-700">{benefitsOrg}</p>
                  </>
                )}
                {delivery && (
                  <>
                    <h3 className="mt-4 text-sm font-semibold text-slate-900">Speaker’s delivery style</h3>
                    <p className="mt-1 whitespace-pre-wrap text-slate-700">{delivery}</p>
                  </>
                )}
              </section>
            )}

            <div id="book" />
          </div>
          <aside className="space-y-8">
            <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
              <h2 className="mb-3 text-lg font-semibold text-slate-900">Quick facts</h2>
              <dl className="space-y-2 text-sm">
                {country && (
                  <div className="flex justify-between"><dt className="text-slate-500">Country</dt><dd className="font-medium text-slate-900">{country}</dd></div>
                )}
                {city && (
                  <div className="flex justify-between"><dt className="text-slate-500">City</dt><dd className="font-medium text-slate-900">{city}</dd></div>
                )}
                {languages && (
                  <div className="flex justify-between"><dt className="text-slate-500">Languages</dt><dd className="font-medium text-slate-900">{Array.isArray(languages)?languages.join(', '):languages}</dd></div>
                )}
                {travel && (
                  <div className="flex justify-between"><dt className="text-slate-500">Availability</dt><dd className="font-medium text-slate-900">{travel}</dd></div>
                )}
                {feeLabel && (
                  <div className="flex justify-between"><dt className="text-slate-500">Fee range</dt><dd className="font-medium text-slate-900">{feeLabel}</dd></div>
                )}
              </dl>
            </section>

            {expertise.length > 0 && (
              <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                <h2 className="mb-3 text-lg font-semibold text-slate-900">Expertise Areas</h2>
                <div className="flex flex-wrap gap-2">
                  {expertise.map((x, i) => (
                    <Chip key={i}>{x}</Chip>
                  ))}
                </div>
              </section>
            )}
          </aside>
        </div>

        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <h2 className="mb-3 text-lg font-semibold text-slate-900">Related speakers</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="h-32 rounded-xl border border-dashed border-slate-200 bg-slate-50" />
            <div className="h-32 rounded-xl border border-dashed border-slate-200 bg-slate-50" />
            <div className="h-32 rounded-xl border border-dashed border-slate-200 bg-slate-50" />
          </div>
        </section>
      </section>
    </main>
  )
}
