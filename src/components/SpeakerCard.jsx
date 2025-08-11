import React from 'react';

export default function SpeakerCard({ speaker, variant = 'search' }) {
  const s = speaker || {};
  const img = s.photoUrl || s.photo || '/images/profile-default.jpg';
  const langsArr = s.spokenLanguages || s.languages || [];
  const langs = Array.isArray(langsArr) ? langsArr.join(', ') : String(langsArr);
  const cityCountry = [s.location, s.country].filter(Boolean).join(', ');
  const locLang = [cityCountry, langs].filter(Boolean).join(' | ');
  const kmFull = s.keyMessage || s.keyMessages || '';
  const km = kmFull.length > 220 ? `${kmFull.slice(0, 220)}…` : kmFull;
  const tags = (s.expertise || s.expertiseAreas || []).slice(0, 3);
  const professionalTitle = s.professionalTitle || s.title;
  const profilePath = `/speaker/${encodeURIComponent(s.id || s.slug)}`;
  const go = (e) => {
    e.preventDefault();
    window.history.pushState({}, '', profilePath);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  // ===== Search page card (bigger, like your mockup) =====
  if (variant === 'search') {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 h-full flex flex-col">
        <div className="w-full flex justify-center">
          <a href={profilePath} onClick={go}>
            <img
              src={img}
              alt={s.name}
              loading="lazy"
              className="w-40 h-40 object-cover rounded-xl"
            />
          </a>
        </div>

        <h3 className="text-lg font-semibold text-center mt-4">
          <a href={profilePath} onClick={go}>{s.name}</a>
        </h3>
        {locLang && <p className="text-sm text-center text-gray-600">{locLang}</p>}
        {professionalTitle && (
          <p className="text-base text-center text-gray-800 mt-1">{professionalTitle}</p>
        )}

        {km && <p className="text-gray-700 mt-3 text-center">{km}</p>}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            {tags.map((t) => (
              <span key={t} className="text-xs bg-indigo-50 px-3 py-1 rounded-full">
                {t}
              </span>
            ))}
          </div>
        )}

        {s.feeRange && (
          <div className="text-base font-semibold text-center mt-4">{s.feeRange}</div>
        )}

        <div className="flex justify-center mt-4">
          <a
            href={profilePath}
            onClick={go}
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-5 rounded-lg"
            aria-label={`View ${s.name}'s profile`}
          >
            View Profile
          </a>
        </div>
      </div>
    );
  }

  // ===== Compact (used on Home) =====
  if (variant === 'compact') {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 h-full">
        <a href={profilePath} onClick={go} className="group block h-full">
          <div className="w-full flex justify-center">
            <img
              src={img}
              alt={s.name}
              loading="lazy"
              className="w-28 h-28 object-cover rounded-lg"
            />
          </div>
          <h3 className="text-base font-semibold text-center mt-3">{s.name}</h3>
          {locLang && <p className="text-xs text-center text-gray-600">{locLang}</p>}
          {professionalTitle && (
            <p className="text-sm text-center text-gray-800 mt-1">{professionalTitle}</p>
          )}
        </a>
      </div>
    );
  }

  return null;
}
