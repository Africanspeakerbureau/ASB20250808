import { useCallback, useEffect, useState } from 'react'
import Header from './Header.jsx'
import SpeakerCard from './SpeakerCard.jsx'
import { listSpeakers } from '../lib/airtableSpeakers'
import { normalizeSpeaker } from '../lib/normalizeSpeaker'

export default function FindSpeakersPage({ countryCode = 'ZA', currency = 'ZAR' } = {}) {
  const [items, setItems] = useState([])
  const [query, setQuery] = useState('')
  const [offset, setOffset] = useState('')
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(false)

  const pageSize = 15

  const fetchPage = useCallback(async ({ reset = false } = {}) => {
    if (loading) return
    setLoading(true)
    try {
      const useOffset = reset ? '' : offset
      const { records, nextOffset } = await listSpeakers({
        q: query,
        pageSize,
        offset: useOffset,
      })
      setItems((prev) => (reset ? records : [...prev, ...records]))
      setOffset(nextOffset || '')
      setHasMore(Boolean(nextOffset))
    } finally {
      setLoading(false)
    }
  }, [query, offset, loading])

  useEffect(() => {
    fetchPage({ reset: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const t = setTimeout(() => fetchPage({ reset: true }), 300)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  return (
    <>
      <Header countryCode={countryCode} currency={currency} />
      <div className="max-w-6xl mx-auto px-4 py-12 mb-16">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold">Find Your Perfect Speaker</h1>
          <p className="text-gray-600 mt-2">Browse our extensive roster of African experts</p>
        </header>

        <div className="mb-6 flex gap-2">
          <input
            className="w-full rounded border px-3 py-2"
            placeholder="Search by name, title, expertise…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((rec) => (
            <SpeakerCard key={rec.id} speaker={normalizeSpeaker(rec)} />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          {hasMore ? (
            <button
              onClick={() => fetchPage()}
              disabled={loading}
              className="px-4 py-2 rounded border border-slate-300 hover:bg-slate-50"
            >
              {loading ? 'Loading…' : 'Load more'}
            </button>
          ) : (
            !loading &&
            items.length > 0 && <div className="text-sm text-slate-500">End of results</div>
          )}
        </div>

        {!loading && items.length === 0 && (
          <div className="mt-8 text-center text-slate-600">No speakers found.</div>
        )}
      </div>
    </>
  )
}
