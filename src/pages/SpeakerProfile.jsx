import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSpeakerById } from '@/lib/airtable';

export default function SpeakerProfile() {
  const { id } = useParams();
  const [speaker, setSpeaker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await getSpeakerById(id);
        if (alive) setSpeaker(data);
      } catch {
        if (alive) setError('Not found');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  if (loading) return <p className="text-center py-16">Loading...</p>;
  if (error || !speaker) return <p className="text-center py-16">Speaker not found.</p>;

  const { photoUrl, name, title, country, spokenLanguages, industry, expertise, bio } = speaker;

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      {photoUrl && (
        <img
          src={photoUrl}
          alt={name}
          className="w-48 h-48 object-cover rounded-full mx-auto mb-6"
        />
      )}
      <h1 className="text-4xl font-bold text-center mb-2">{name}</h1>
      {title && <p className="text-center text-gray-600 mb-4">{title}</p>}
      <div className="text-center text-gray-700 space-y-1 mb-8">
        {country && <p>{country}</p>}
        {spokenLanguages?.length > 0 && (
          <p>Languages: {spokenLanguages.join(', ')}</p>
        )}
        {industry && <p>Industry: {industry}</p>}
        {expertise?.length > 0 && (
          <p>Expertise: {expertise.join(', ')}</p>
        )}
      </div>
      {bio && (
        <p className="text-gray-700 max-w-2xl mx-auto whitespace-pre-line">{bio}</p>
      )}
      <div className="mt-8 text-center">
        <a href="/find" className="btn btn-primary">Back to Speakers</a>
      </div>
    </div>
  );
}
