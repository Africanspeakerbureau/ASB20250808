import React from "react";

/**
 * MeetOurSpeakers
 * Props:
 *  - speakers: array of normalized speaker objects
 *    expected fields (any of these, we defensively fallback):
 *      id, slug, fullName | name | (title + firstName + lastName)
 *      professionalTitle | titleText
 *      keyMessages | keyMessage
 *      photoUrl | profileImage?.[0]?.thumbnails?.large?.url | profileImage?.[0]?.url
 */
export default function MeetOurSpeakers({ speakers = [] }) {
  const items = Array.isArray(speakers) ? speakers.slice(0, 8) : [];

  const getName = (s) =>
    s.fullName ||
    s.name ||
    [s.title, s.firstName, s.lastName].filter(Boolean).join(" ") ||
    "Unnamed Speaker";

  const getPhoto = (s) =>
    s.photoUrl ||
    s?.profileImage?.[0]?.thumbnails?.large?.url ||
    s?.profileImage?.[0]?.url ||
    "/assets/placeholder-avatar.png";

  const getRole = (s) =>
    s.professionalTitle || s.titleText || "";

  const getMessage = (s) =>
    s.keyMessages || s.keyMessage || "";

  if (!items.length) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-semibold text-center md:text-left">Meet Our Speakers</h2>
          <p className="text-gray-500 mt-1 text-center md:text-left">Voices That Inspire</p>
          <p className="text-gray-400 mt-10">No speakers available at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-semibold text-center md:text-left">Meet Our Speakers</h2>
        <p className="text-gray-500 mt-1 text-center md:text-left">Voices That Inspire</p>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {items.map((s) => {
            const slug = s.slug || s.id;
            const href = `/speakers/${slug}`;
            return (
              <a key={s.id || href} href={href} className="block group">
                <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-sm">
                  <img
                    src={getPhoto(s)}
                    alt={getName(s)}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="mt-3 text-center">
                  <div className="font-semibold">{getName(s)}</div>
                  {getRole(s) && (
                    <div className="text-sm text-gray-600">{getRole(s)}</div>
                  )}
                  {getMessage(s) && (
                    <div className="mt-2 text-sm text-gray-500 line-clamp-2">
                      {getMessage(s)}
                    </div>
                  )}
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

