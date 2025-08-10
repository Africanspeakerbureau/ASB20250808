import { useEffect, useState } from 'react';
import SpeakerCard from '@/components/SpeakerCard';
import { fetchFeaturedSpeakers } from '@/lib/airtable';

const toSlug = (s = '') =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

const shapeSpeaker = (r = {}) => {
  const first = r.firstName || r.first_name || r.name?.split(' ')[0] || ''
  const last =
    r.lastName || r.last_name || r.name?.split(' ').slice(1).join(' ') || ''
  const full = r.fullName || r.full_name || r.name || `${first} ${last}`.trim()
  return {
    ...r,
    recordId: r.recordId || r.id || r.record_id,
    id: r.id,
    slug: r.slug || toSlug(full),
    firstName: first,
    lastName: last,
    fullName: full,
  }
}

export default function FeaturedSpeakers() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const rows = await fetchFeaturedSpeakers(3);
        if (alive) setItems((rows || []).map(shapeSpeaker));
      } catch (e) {
        console.error('FeaturedSpeakers load failed', e);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        <div>
          <h2 className="text-3xl font-semibold mb-4">Why African Speaker Bureau?</h2>
          <p className="text-gray-600 leading-7">
            We are the exclusive gateway to authentic African expertise, connecting global audiences with the continent's most compelling voices who bring unparalleled insights and transformative perspectives.
          </p>
        </div>
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {items.slice(0, 3).map((s) => (
              <SpeakerCard key={s.id} speaker={s} variant="compact" />
            ))}
          </div>

          <div className="mt-8">
            <a
              href="/find"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg"
            >
              View all speakers
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
