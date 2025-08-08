import React from 'react';

export default function SpeakerCard({ speaker, variant = 'search' }) {
  const s = speaker || {};
  const img = s.photo || '/images/profile-default.jpg';
  const langs = Array.isArray(s.spokenLanguages) ? s.spokenLanguages.join(', ') : (s.spokenLanguages || '')
  const cityCountry = [s.location, s.country].filter(Boolean).join(', ')
  const locLang = [cityCountry, langs].filter(Boolean).join(' | ')
  const kmFull = s.keyMessage || '';
  const km = kmFull.length > 220 ? `${kmFull.slice(0, 220)}…` : kmFull;
  const tags = (s.expertise || []).slice(0, 3);

  const Wrapper = ({ children }) => (
    <a href={`/speakers/${s.id}`} className="group block h-full">{children}</a>
  );

  // ===== Search page card (bigger, like your mockup) =====
  if (variant === 'search') {
    return (
      <div className="bg-white rounded-2xl shadow p-6 h-full flex flex-col">
        <Wrapper>
          <div className="w-full flex justify-center">
            <img
              src={img}
              alt={s.name}
              loading="lazy"
              className="w-40 h-40 object-cover rounded-xl"
            />
          </div>

          <h3 className="text-lg font-semibold text-center mt-4">{s.name}</h3>
          {locLang && <p className="text-sm text-center text-gray-600">{locLang}</p>}
          {s.professionalTitle && (
            <p className="text-base text-center text-gray-800 mt-1">{s.professionalTitle}</p>
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
            <span className="inline-block bg-blue-600 group-hover:bg-blue-700 text-white text-sm font-semibold py-2 px-5 rounded-lg">
              View Profile
            </span>
          </div>
        </Wrapper>
      </div>
    );
  }

  // ===== Compact (used on Home) – unchanged =====
  if (variant === 'compact') {
    return (
      <div className="bg-white rounded-xl shadow p-5 h-full">
        <Wrapper>
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
          {s.professionalTitle && (
            <p className="text-sm text-center text-gray-800 mt-1">{s.professionalTitle}</p>
          )}
        </Wrapper>
      </div>
    );
  }

  return null;
}

