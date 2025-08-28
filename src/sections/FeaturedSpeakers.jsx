import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SpeakerCard from '@/components/SpeakerCard';
import { listSpeakers } from '@/lib/airtable';

export default function FeaturedSpeakers() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const all = await listSpeakers();
        if (alive) setItems(all.filter((s) => s.featured).slice(0, 4));
      } catch (e) {
        console.error('Failed to load speakers:', e?.status || '', e?.body || e);
        if (alive) setError('Could not load speakers.');
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section id="featured-speakers" className="py-12">
      <div className="mx-auto max-w-[1280px] px-6 grid grid-cols-12 gap-x-8 gap-y-10">
        <div className="col-span-12 lg:col-span-5">
          <h2 className="text-3xl font-semibold mb-4 text-center md:text-left">Featured Speakers</h2>
          <p className="text-gray-700 text-center md:text-left">
            We are the exclusive gateway to authentic African expertise, connecting global audiences with the continent’s most compelling voices who bring unparalleled insights and transformative perspectives.
          </p>
          <p className="mt-3 text-gray-500 italic text-center md:text-left">
            Please note: This website is still in development — be part of the beta launch of ASB’s new virtual home.
          </p>
          <div className="flex justify-center md:justify-start mt-6">
            <Link
              to="/find-speakers"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg"
            >
              View all speakers
            </Link>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-7">
          {error && <p className="text-red-600">{error}</p>}
          {!error && items.length === 0 && (
            <p className="text-gray-400">No speakers available at the moment.</p>
          )}
          {!error && items.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {items.map((s) => (
                <SpeakerCard key={s.id} speaker={s} variant="featured" />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
