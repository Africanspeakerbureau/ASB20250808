import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchAllPublishedSpeakers } from '../lib/airtable';

export default function SpeakerProfile() {
  const { slug } = useParams();
  const [speaker, setSpeaker] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const rows = await fetchAllPublishedSpeakers({ limit: 100 });
        const found = rows.find((s) => s.slug === slug);
        if (alive) setSpeaker(found || null);
      } catch (e) {
        console.error('Load speaker failed', e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [slug]);

  if (loading) return <p className="text-center py-16">Loading...</p>;
  if (!speaker) return <p className="text-center py-16">Speaker not found.</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      {speaker.photoUrl && (
        <img
          src={speaker.photoUrl}
          alt={speaker.name}
          className="w-48 h-48 object-cover rounded-full mx-auto mb-6"
        />
      )}
      <h1 className="text-4xl font-bold mb-2">{speaker.name}</h1>
      {speaker.title && <p className="text-gray-600 mb-4">{speaker.title}</p>}
      {speaker.keyMessage && (
        <p className="text-gray-700 max-w-2xl mx-auto">{speaker.keyMessage}</p>
      )}
      <div className="mt-8">
        <Link to="/find" className="btn btn-primary">Back to Speakers</Link>
      </div>
    </div>
  );
}
