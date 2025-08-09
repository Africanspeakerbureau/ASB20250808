import { useEffect, useState } from 'react';
import SpeakerCard from '@/components/SpeakerCard';
import { fetchFeaturedSpeakers } from '@/lib/airtable';

export default function FeaturedSpeakers() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const rows = await fetchFeaturedSpeakers(3);
        if (alive) setItems(rows);
      } catch (e) {
        console.error('FeaturedSpeakers load failed', e);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-4">Featured Speakers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
          {items.map((s) => (
            <SpeakerCard key={s.id} speaker={s} variant="compact" />
          ))}
        </div>
        <div className="text-center">
          <a
            href="/find-speakers"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg"
          >
            VIEW ALL SPEAKERS
          </a>
        </div>
      </div>
    </section>
  );
}
