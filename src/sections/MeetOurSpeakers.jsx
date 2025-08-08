import { useEffect, useState } from 'react';
import SpeakerCard from '@/components/SpeakerCard';
import { fetchPublishedSpeakers } from '@/lib/airtable';

export default function MeetOurSpeakers() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const rows = await fetchPublishedSpeakers({ limit: 8, excludeFeatured: true });
        if (alive) setItems(rows);
      } catch (e) {
        console.error('MeetOurSpeakers load failed', e);
        if (alive) setItems([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-semibold">Meet Our Speakers</h2>
        <p className="text-gray-600 mb-8">Voices That Inspire</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((s) => (
            <SpeakerCard key={s.id} speaker={s} variant="compact" />
          ))}
        </div>

        {items.length === 0 && (
          <p className="text-gray-500">No speakers found.</p>
        )}
      </div>
    </section>
  );
}
