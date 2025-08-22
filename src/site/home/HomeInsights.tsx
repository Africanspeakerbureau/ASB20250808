import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listFeaturedPosts } from '../../lib/airtable';
import { pickBlogThumb } from '../../lib/blogMedia';

const TOKENS = {
  surface: '#F3F5F9',
  navy:    '#1E3A8A',
  border:  '#E5E7EB',
  text:    '#0A0A0A',
  muted:   '#4B5563',
};

export default function HomeInsights() {
  const [items, setItems] = useState<any[] | null>(null);

  useEffect(() => {
    (async () => {
      const rows = await listFeaturedPosts(2);
      setItems(rows);
    })();
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">Insights from Our Speakers</h2>
        <p className="mt-2 text-lg" style={{ color: TOKENS.muted }}>
          Latest videos and articles from our thought leaders
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {(items || [null, null]).slice(0, 2).map((it, idx) => {
          if (!it) {
            return (
              <div key={idx} className="rounded-3xl overflow-hidden bg-white border" style={{ borderColor: TOKENS.border }}>
                <div className="h-56 bg-gray-100" />
                <div className="p-6">
                  <div className="h-6 w-2/3 bg-gray-100 rounded mb-2" />
                  <div className="h-4 w-full bg-gray-100 rounded" />
                </div>
              </div>
            );
          }

          const img = pickBlogThumb(it);
          const isVideo = (it.Type || '').toLowerCase() === 'video';

          return (
            <Link
              to={`/blog/${it.Slug || ''}`}
              key={it.id}
              className="rounded-3xl overflow-hidden bg-white border block hover:shadow-sm transition"
              style={{ borderColor: TOKENS.border }}
            >
              <div className="h-56 relative bg-gray-100">
                {img && <img src={img} alt="" className="h-full w-full object-cover" loading="lazy" />}
                <span className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="inline-flex h-14 w-14 items-center justify-center rounded-full"
                    style={{ backgroundColor: isVideo ? '#2563EB' : '#16A34A' }}
                  >
                    {/* play or lines icon */}
                    {isVideo ? (
                      <svg viewBox="0 0 24 24" width="26" height="26"><path d="M8 5v14l11-7z" fill="#fff"/></svg>
                    ) : (
                      <svg viewBox="0 0 24 24" width="22" height="22"><path d="M7 7h10v2H7zm0 4h10v2H7zm0 4h7v2H7z" fill="#fff"/></svg>
                    )}
                  </span>
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900">{it.Name}</h3>
                {it.Excerpt && <p className="mt-2 text-[15px]" style={{ color: TOKENS.muted }}>{it.Excerpt}</p>}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

