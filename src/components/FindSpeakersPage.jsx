import { useEffect, useMemo, useState } from 'react'
import { fetchAllPublishedSpeakers } from '../lib/airtable'
import Footer from '../components/Footer'
import { Button } from '@/components/ui/button.jsx'

// Compact, search-variant card (square image)
function SearchCard({ s }) {
  const cityCountry = [s.location, s.country].filter(Boolean).join(', ')
  const langs = (s.spokenLanguages || []).join(', ')
  const locLang = [cityCountry, langs].filter(Boolean).join(' | ')
  const profilePath = `/speaker/${encodeURIComponent(s.id || s.slug)}`
  const go = (e) => {
    e.preventDefault()
    window.history.pushState({}, '', profilePath)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center">
      <a href={profilePath} onClick={go} className="w-40 h-40 rounded-xl overflow-hidden bg-gray-100 mb-6">
        {s.photoUrl
          ? <img src={s.photoUrl} alt={s.name} className="w-full h-full object-cover" />
          : <div className="w-full h-full grid place-items-center text-gray-400 text-sm">No Image</div>
        }
      </a>

      <h3 className="text-xl font-semibold">
        <a href={profilePath} onClick={go}>{s.name}</a>
      </h3>
      {s.title && <p className="text-gray-600 mt-1">{s.title}</p>}
      {locLang && <p className="text-gray-500 mt-1 text-sm">{locLang}</p>}

      {s.keyMessage && (
        <p className="text-gray-700 mt-4 text-[15px] leading-6 max-w-md">
          {s.keyMessage.length > 220 ? s.keyMessage.slice(0, 217) + '…' : s.keyMessage}
        </p>
      )}

      {!!(s.expertise && s.expertise.length) && (
        <div className="mt-5 flex flex-wrap gap-2 justify-center">
          {s.expertise.slice(0, 4).map(tag => (
            <span key={tag} className="px-3 py-[6px] rounded-full text-sm bg-indigo-50 text-indigo-700">
              {tag}
            </span>
          ))}
        </div>
      )}

      {s.feeRange && <p className="mt-5 font-medium">{s.feeRange}</p>}

      <a
        href={profilePath}
        onClick={go}
        className="mt-6 inline-block px-5 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
        aria-label={`View ${s.name}'s profile`}
      >
        View Profile
      </a>
    </div>
  )
}

export default function FindSpeakersPage() {
  const [all, setAll] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('All Categories')
  const [country, setCountry] = useState('All Countries')
  const [lang, setLang] = useState('All Languages')
  const [fee, setFee] = useState('All Fee Ranges')
  const [currency, setCurrency] = useState('ZAR')
  const [countryCode, setCountryCode] = useState('ZA')
  const [, setCurrencyInfo] = useState({ currency: 'ZAR', rate: 1 })

  const handleNav = (e) => {
    e.preventDefault()
    const href = e.currentTarget.getAttribute('href')
    window.history.pushState({}, '', href)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  // fetch from Airtable directly (no reliance on App state)
  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        setLoading(true)
        const rows = await fetchAllPublishedSpeakers({ limit: 15 })
        if (alive) setAll(rows)
      } catch (e) {
        console.error('Fetch speakers failed:', e)
        if (alive) setError('Could not load speakers.')
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => { alive = false }
  }, [])

  // Build dropdown options from data
  const { categories, countries, languages, feeRanges } = useMemo(() => {
    const cats = new Set(), ctys = new Set(), lngs = new Set(), fees = new Set()
    all.forEach(s => {
      ;(s.expertise || []).forEach(v => cats.add(v))
      if (s.country) ctys.add(s.country)
      ;(s.spokenLanguages || []).forEach(v => lngs.add(v))
      if (s.feeRange) fees.add(s.feeRange)
    })
    return {
      categories: ['All Categories', ...Array.from(cats).sort()],
      countries:  ['All Countries',  ...Array.from(ctys).sort()],
      languages:  ['All Languages',  ...Array.from(lngs).sort()],
      feeRanges:  ['All Fee Ranges',  ...Array.from(fees).sort()],
    }
  }, [all])

  // Apply filters
  const filtered = useMemo(() => {
    const text = q.trim().toLowerCase()
    return all.filter(s => {
      if (cat !== 'All Categories' && !(s.expertise || []).includes(cat)) return false
      if (country !== 'All Countries' && s.country !== country) return false
      if (lang !== 'All Languages' && !(s.spokenLanguages || []).includes(lang)) return false
      if (fee !== 'All Fee Ranges' && s.feeRange !== fee) return false

      if (text) {
        const hay = [
          s.name, s.title, s.keyMessage,
          (s.expertise || []).join(' '),
          s.location, s.country, (s.spokenLanguages || []).join(' ')
        ].join(' ').toLowerCase()
        if (!hay.includes(text)) return false
      }
      return true
    })
  }, [all, q, cat, country, lang, fee])

  // Show exactly 15 cards (5 rows × 3)
  const top15 = filtered.slice(0, 15)

  return (
    <>
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <a href="/" onClick={handleNav} className="h-12 flex items-center">
              <div className="bg-blue-900 rounded px-3 py-2 flex items-center justify-center min-w-[50px]">
                <span className="text-white font-bold text-lg">ASB</span>
              </div>
              <div className="ml-3">
                <span className="text-sm font-medium leading-tight block text-blue-900">AFRICAN</span>
                <span className="text-sm font-medium leading-tight block text-blue-900">SPEAKER</span>
                <span className="text-sm font-medium leading-tight block text-blue-900">BUREAU</span>
              </div>
            </a>

            <div className="flex items-center">
              <div
                className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer"
                onClick={() => {
                  const currencies = ['USD', 'ZAR', 'GBP', 'EUR']
                  const countries = ['US', 'ZA', 'GB', 'EU']
                  const currentIndex = currencies.indexOf(currency)
                  const nextIndex = (currentIndex + 1) % currencies.length
                  setCountryCode(countries[nextIndex])
                  setCurrency(currencies[nextIndex])
                  setCurrencyInfo({ currency: currencies[nextIndex], rate: 1 })
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-globe h-4 w-4" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
                  <path d="M2 12h20"></path>
                </svg>
                <span>{countryCode}</span>
                <span className="text-blue-600 font-medium">{currency}</span>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <Button asChild variant="ghost"><a href="/" onClick={handleNav}>Home</a></Button>
              <Button asChild variant="ghost"><a href="/find" onClick={handleNav}>Find Speakers</a></Button>
              <Button asChild variant="ghost"><a href="/services" onClick={handleNav}>Services</a></Button>
              <Button asChild variant="ghost"><a href="/about" onClick={handleNav}>About</a></Button>
              <Button asChild variant="ghost"><a href="/#contact" onClick={handleNav}>Contact</a></Button>
              <Button asChild variant="ghost"><a href="/admin" onClick={handleNav}>Admin</a></Button>
              <Button asChild><a href="/book-a-speaker">Book a Speaker</a></Button>
            </nav>
          </div>
        </div>
      </header>
      <div className="max-w-6xl mx-auto px-4 py-12 mb-16">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold">Find Your Perfect Speaker</h1>
          <p className="text-gray-600 mt-2">Browse our extensive roster of African experts</p>
        </header>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 mb-8">
        <div className="grid md:grid-cols-4 gap-4">
          <input
            type="text"
            className="col-span-1 md:col-span-4 lg:col-span-4 border rounded-lg px-4 py-3"
            placeholder="Search speakers…"
            value={q}
            onChange={e => setQ(e.target.value)}
          />
          <select className="border rounded-lg px-3 py-3" value={cat} onChange={e => setCat(e.target.value)}>
            {categories.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <select className="border rounded-lg px-3 py-3" value={country} onChange={e => setCountry(e.target.value)}>
            {countries.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <select className="border rounded-lg px-3 py-3" value={lang} onChange={e => setLang(e.target.value)}>
            {languages.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <select className="border rounded-lg px-3 py-3" value={fee} onChange={e => setFee(e.target.value)}>
            {feeRanges.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      </div>

      {loading && <p className="text-center text-gray-600">Loading…</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {top15.map(s => <SearchCard key={s.id} s={s} />)}
        </div>
      )}
      </div>
      <Footer />
    </>
  )
}
