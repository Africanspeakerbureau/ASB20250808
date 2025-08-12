import React from 'react';
export default function PlanYourEvent({ appActions }) {
  return (
    <section id="services" className="scroll-mt-24 py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-2xl font-semibold mb-4">Plan Your Event with ASB</h2>
        <p className="text-gray-700 mb-6">
          Let us help you find the perfect speaker to elevate your next event. From keynotes to workshops,
          we have the expertise to make your event unforgettable.
        </p>
        <a
          href="#/book-a-speaker"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg"
          onClick={(e) => { e.preventDefault(); appActions.openBooking(); }}
        >
          Booking Inquiry
        </a>
      </div>
    </section>
  );
}
