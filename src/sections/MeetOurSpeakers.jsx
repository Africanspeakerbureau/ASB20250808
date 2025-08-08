import React, { useEffect, useState } from 'react';
import SpeakerCard from '@/components/SpeakerCard';

const BASE = import.meta.env.VITE_AIRTABLE_BASE_ID || process.env.REACT_APP_AIRTABLE_BASE_ID;
const KEY  = import.meta.env.VITE_AIRTABLE_API_KEY || process.env.REACT_APP_AIRTABLE_API_KEY;
const TBL  = import.meta.env.VITE_AIRTABLE_SPEAKERS_TABLE_ID
          || process.env.REACT_APP_AIRTABLE_SPEAKERS_TABLE_ID
          || 'Speaker%20Applications';

const FIELDS = [
  'First Name','Last Name','Profile Image','Key Messages','Professional Title',
  'Country','Spoken Languages','Expertise Areas','Fee Range','Status','Featured'
];
const fieldParams = FIELDS.map(f => `&fields[]=${encodeURIComponent(f)}`).join('');
const arr = v => Array.isArray(v) ? v : v ? [v] : [];
const first = v => Array.isArray(v) ? (v[0] || '') : (v || '');

export default function MeetOurSpeakers() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const headers = { Authorization: `Bearer ${KEY}` };
    let url = `https://api.airtable.com/v0/${BASE}/${TBL}?pageSize=100${fieldParams}`;
    const all = [];

    (async () => {
      try {
        while (url) {
          const res = await fetch(url, { headers });
          if (!res.ok) throw new Error(`Airtable ${res.status} ${res.statusText}`);
          const json = await res.json();
          all.push(...(json.records || []));
          url = json.offset
            ? `https://api.airtable.com/v0/${BASE}/${TBL}?pageSize=100&offset=${json.offset}${fieldParams}`
            : null;
        }

        const mapped = all
          .filter(r => {
            const f = r.fields || {};
            const status = f['Status'];
            const isPublished = Array.isArray(status)
              ? status.includes('Published on Site')
              : status === 'Published on Site';
            const featured = (f['Featured'] || '').toString().toLowerCase() === 'yes';
            return isPublished && !featured;
          })
          .slice(0, 8)
          .map(r => {
            const f = r.fields || {};
            return {
              id: r.id,
              name: `${f['First Name'] || ''} ${f['Last Name'] || ''}`.trim(),
              professionalTitle: f['Professional Title'] || '',
              location: f['Country'] || '',
              languages: arr(f['Spoken Languages']),
              expertise: arr(f['Expertise Areas']),
              keyMessage: first(f['Key Messages']),
              feeRange: f['Fee Range'] || '',
              photo: (f['Profile Image'] && f['Profile Image'][0]?.url) || '/images/profile-default.jpg',
            };
          });

        setItems(mapped);
      } catch (e) {
        console.error('MeetOurSpeakers load failed', e);
        setItems([]);
      }
    })();
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-semibold">Meet Our Speakers</h2>
        <p className="text-gray-600 mb-8">Voices That Inspire</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map(s => (
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

