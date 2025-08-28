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
    <section id="featured-speakers" className="section bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-12">
          <div className="lg:col-span-5 lg:pr-6 max-w-[560px]">
            <h2 className="text-3xl font-semibold mb-4 text-center md:text-left">Featured Speakers</h2>
            <div className="space-y-4 text-foreground">
            <p className="text-base md:text-lg leading-7">
              The African Speaker Bureau connects decision-makers with credible African voices who deliver <strong>leadership insights, market intelligence, and change-making stories</strong> to the room — context your executives can act on. We pair authentic African context with global standards — rapid shortlists, transparent pricing, clear contracting, travel coordination and post-event materials.
            </p>

            <blockquote className="border-l-2 border-muted pl-4 text-base md:text-lg leading-7">
              “The great powers of the world may have done wonders in giving the world an industrial look, but the great gift still has to come from Africa – giving the world a more human face.”<br />— <strong>Steve Biko</strong>
            </blockquote>

            <p className="text-base md:text-lg leading-7">
              We build on that belief. We curate speakers who pair commercial rigour with a deeply human perspective — and we manage every engagement end-to-end: rapid shortlists, transparent pricing, clear contracting, travel coordination and post-event materials.
            </p>

            <p className="text-base md:text-lg leading-7">
              Choose ASB for <strong>authentic African context with global standards</strong> — reliable delivery, real-world outcomes, and voices your leaders will remember long after the event.
            </p>

            <p className="text-sm italic text-muted mt-2">
              This site is in active development — thanks for being part of ASB’s beta launch.
            </p>
          </div>
          <div className="flex justify-center md:justify-start mt-6">
            <Link
              to="/find-speakers"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg"
            >
              View all speakers
            </Link>
          </div>
          </div>

          <div className="lg:col-span-7 xl:col-span-6">
            {error && <p className="text-red-600">{error}</p>}
            {!error && items.length === 0 && (
              <p className="text-gray-400">No speakers available at the moment.</p>
            )}
            {!error && items.length > 0 && (
              <div className="grid grid-cols-2 gap-5">
                {items.map((s) => (
                  <SpeakerCard key={s.id} speaker={s} variant="featured" />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
