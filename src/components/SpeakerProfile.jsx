import React from 'react'
import { useParams } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

const toSlug = (s = '') =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export default function SpeakerProfile({ speakers = [] }) {
  const { id: idOrSlug } = useParams()

  const speaker =
    speakers.find((s) => s.recordId === idOrSlug) ||
    speakers.find((s) => String(s.id) === String(idOrSlug)) ||
    speakers.find((s) => s.slug === idOrSlug) ||
    speakers.find(
      (s) => toSlug(`${s.firstName || ''} ${s.lastName || ''}`) === idOrSlug
    )

  if (!speaker) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-16">
          <h1>Speaker not found</h1>
          <p>
            We couldn’t locate that profile. Please return to{' '}
            <a href="/find" className="text-blue-600 underline">
              Find Speakers
            </a>
            .
          </p>
        </main>
        <Footer />
      </>
    )
  }

  const feeText =
    speaker.displayFee && String(speaker.displayFee).toLowerCase() === 'no'
      ? 'On Request'
      : speaker.feeRange || 'On Request'

  const keyMessages = speaker.keyMessages || speaker.key_messages || ''
  const bio = speaker.professionalBio || speaker.bio || ''
  const achievements =
    speaker.achievements || speaker.notableAchievements || ''
  const education = speaker.education || ''
  const topicsRaw = speaker.speakingTopics || speaker.topics || ''
  const topics = Array.isArray(topicsRaw)
    ? topicsRaw
    : String(topicsRaw)
        .split('\n')
        .map((t) => t.trim())
        .filter(Boolean)

  const chipCls =
    'inline-flex items-center rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-sm text-gray-700'

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-semibold">{speaker.fullName}</h1>
        {speaker.professionalTitle && (
          <p className="text-neutral-600 mt-1">{speaker.professionalTitle}</p>
        )}

        <ul className="flex flex-wrap gap-2 mt-4">
          {speaker.spokenLanguages && (
            <li className={chipCls}>
              {Array.isArray(speaker.spokenLanguages)
                ? speaker.spokenLanguages.join(', ')
                : speaker.spokenLanguages}
            </li>
          )}
          {speaker.country && <li className={chipCls}>{speaker.country}</li>}
          {speaker.travelWillingness && (
            <li className={chipCls}>{speaker.travelWillingness}</li>
          )}
          <li className={chipCls}>{feeText}</li>
        </ul>

        <section className="mt-10">
          <h2 className="text-xl font-semibold">Key Messages</h2>
          {keyMessages ? (
            <p className="mt-2 whitespace-pre-line">{keyMessages}</p>
          ) : (
            <p className="mt-2 text-gray-500">—</p>
          )}
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold">About</h2>
          {bio && (
            <>
              <h3 className="mt-4 font-medium">Professional Bio</h3>
              <p className="mt-1 whitespace-pre-line">{bio}</p>
            </>
          )}
          {achievements && (
            <>
              <h3 className="mt-4 font-medium">Achievements</h3>
              <p className="mt-1 whitespace-pre-line">{achievements}</p>
            </>
          )}
          {education && (
            <>
              <h3 className="mt-4 font-medium">Education</h3>
              <p className="mt-1 whitespace-pre-line">{education}</p>
            </>
          )}
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold">Speaking Topics</h2>
          {topics.length ? (
            <ul className="list-disc pl-6 space-y-1 mt-2">
              {topics.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-gray-500">—</p>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}

