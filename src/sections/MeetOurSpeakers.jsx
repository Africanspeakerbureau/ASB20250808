import SpeakerCard from '../components/SpeakerCard'

export default function MeetOurSpeakers({ speakers = [] }) {
  const items = (speakers || []).slice(0, 8)

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <header className="mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-center md:text-left">Meet Our Speakers</h2>
          <p className="text-gray-500 text-center md:text-left">Voices That Inspire</p>
        </header>

        {items.length === 0 ? (
          <p className="text-gray-400">No speakers available at the moment.</p>
        ) : (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center lg:justify-items-stretch">
            {items.map((s) => (
              <SpeakerCard key={s.id} speaker={s} variant="compact" />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
