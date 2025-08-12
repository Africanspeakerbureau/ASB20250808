import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        <div>
          <h2 className="text-3xl font-semibold mb-4 text-center md:text-left">Why African Speaker Bureau?</h2>
          <p className="text-gray-700 text-center md:text-left">
            We are the exclusive gateway to authentic African expertise, connecting global audiences with the continent’s most compelling voices who bring unparalleled insights and transformative perspectives.
          </p>
          <p className="mt-3 text-gray-500 italic text-center md:text-left">
            Please note: This website is still in development — be part of the beta launch of ASB’s new virtual home.
          </p>
        </div>
        <div>
          <h3 className="text-3xl font-semibold mb-4 text-center md:text-left">Featured Speakers</h3>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center lg:justify-items-stretch">
            {items.slice(0, 3).map((s) => (
              <SpeakerCard key={s.id} speaker={s} variant="compact" />
            ))}
          </div>

          <div className="flex justify-center md:justify-start mt-8">
            <Link
              to="/find-speakers"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg"
            >
              View all speakers
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
