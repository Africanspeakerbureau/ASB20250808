import { useCallback, useEffect, useState } from 'react'
import Header from './Header.jsx'
import SpeakerCard from './SpeakerCard.jsx'
import { listSpeakers } from '../lib/airtableSpeakers'
import { normalizeSpeaker } from '../lib/normalizeSpeaker'

export default function FindSpeakersPage({ countryCode='ZA', currency='ZAR' } = {}) {
  const [items, setItems] = useState([])
  const [query, setQuery] = useState('')
  const [offset, setOffset] = useState('')
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const pageSize = 15

  const fetchPage = useCallback(async ({ reset=false } = {}) => {
    if (loading) return
    setLoading(true)
    setError("")
    try {
      const useOffset = reset ? '' : offset
      const { records, nextOffset } = await listSpeakers({ q: query, pageSize, offset: useOffset })
      setItems(prev => reset ? records : [...prev, ...records])
      setOffset(nextOffset || '')
      setHasMore(Boolean(nextOffset))
    } catch (e) {
      setError(String(e?.message || e))
      setItems([])
      setOffset('')
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }, [query, offset, loading])

  useEffect(() => { fetchPage({ reset: true }) /* on mount */ }, []) // eslint-disable-line
  useEffect(() => {
    const t = setTimeout(() => fetchPage({ reset: true }), 300)
    return () => clearTimeout(t)
  }, [query]) // eslint-disable-line

  return (
    <>
      <Header countryCode={countryCode} currency={currency} />
      <div className="max-w-6xl mx-auto px-4 py-12 mb-16">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold">Find Your Perfect Speaker</h1>
          <p className="text-gray-600 mt-2">Browse our extensive roster of African experts</p>
        </header>

        {/* Search bar – always visible */}
        <div className="mb-6">
          <input
            className="w-full rounded border px-4 py-3"
            placeholder="Search by name, title, expertise..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {error && <p className="text-center text-red-600 mb-4">{error}</p>}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((rec) => {
            const s = normalizeSpeaker ? normalizeSpeaker(rec) : rec
            // ⬇ use the prop SpeakerCard expects (from STEP 0)
            return <SpeakerCard key={rec.id} speaker={s} />
          })}
        </div>

        <div className="mt-8 flex justify-center">
          {hasMore ? (
            <button onClick={() => fetchPage()} disabled={loading}
              className="px-4 py-2 rounded border border-slate-300 hover:bg-slate-50">
              {loading ? 'Loading…' : 'Load more'}
            </button>
          ) : (
            !loading && items.length > 0 && <div className="text-sm text-slate-500">End of results</div>
          )}
        </div>

        {!loading && !error && items.length === 0 && (
          <div className="mt-8 text-center text-slate-600">No speakers found.</div>
        )}
      </div>
    </>
  )
}
