import React from 'react';

export default function About({ speaker }) {
  if (!speaker) return null;
  const { bio, achievements, education } = speaker;
  if (!bio && !achievements && !education) return null;

  return (
    <section className="card">
      <h2 className="card-title">About</h2>
      {bio && (
        <>
          <h3 className="font-medium text-gray-900">Professional Bio</h3>
          <p className="whitespace-pre-line mb-4">{bio}</p>
        </>
      )}
      {achievements && (
        <>
          <h3 className="font-medium text-gray-900">Achievements</h3>
          <p className="whitespace-pre-line mb-4">{achievements}</p>
        </>
      )}
      {education && (
        <>
          <h3 className="font-medium text-gray-900">Education</h3>
          <p className="whitespace-pre-line">{education}</p>
        </>
      )}
    </section>
  );
}
