import { useEffect, useState } from 'react'
import SpeakerCard from '../components/SpeakerCard'
import { fetchAllApprovedPublishedSpeakers as fetchAll } from '@/lib/airtable'

function sampleRandom(arr, n) {
  const copy = arr.slice()
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy.slice(0, n)
}

export default function MeetOurSpeakers() {
  const [items, setItems] = useState([])

  useEffect(() => {
    let alive = true
    ;(async () => {
      const rows = await fetchAll({ pageSize: 100, max: 400 })
      if (alive) setItems(sampleRandom(rows, 8))
    })()
    return () => {
      alive = false
    }
  }, [])

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <header className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold">Meet Our Speakers</h2>
          <p className="text-gray-500 mt-2">Voices That Inspire</p>
        </header>

        {items.length === 0 ? (
          <p className="text-gray-400">No speakers available at the moment.</p>
        ) : (
          <div className="grid gap-8 grid-cols-2 md:grid-cols-4 lg:grid-cols-4 justify-items-center lg:justify-items-stretch">
            {items.map((s) => (
              <SpeakerCard key={s.id} speaker={s} variant="compact" />
            ))}
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <a
            href="/#/find-speakers"
            className="inline-flex items-center px-5 py-3 rounded-lg border border-slate-300 hover:bg-slate-50"
          >
            Find more speakers
          </a>
        </div>
      </div>
    </section>
  )
}
