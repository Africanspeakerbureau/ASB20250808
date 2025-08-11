import React from 'react';

export default function Footer() {

  const handleNav = (e) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    window.history.pushState({}, '', href);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <footer className="bg-slate-900 text-slate-200 mt-16">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="h-12 flex items-center mb-6">
              <div className="bg-blue-600 rounded px-3 py-2 flex items-center justify-center min-w-[50px]">
                <span className="text-white font-bold text-lg">ASB</span>
              </div>
              <div className="ml-3">
                <span className="text-sm font-medium leading-tight block">AFRICAN</span>
                <span className="text-sm font-medium leading-tight block">SPEAKER</span>
                <span className="text-sm font-medium leading-tight block">BUREAU</span>
              </div>
            </div>
            <p className="text-gray-400">
              Connecting authentic African voices with global audiences since 2008.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="/" onClick={handleNav} className="hover:underline">Home</a></li>
              <li><a href="/find" onClick={handleNav} className="hover:underline">Find Speakers</a></li>
              <li><a href="/services" onClick={handleNav} className="hover:underline">Services</a></li>
              <li><a href="/about" onClick={handleNav} className="hover:underline">About</a></li>
              <li><a href="/#contact" onClick={handleNav} className="hover:underline">Contact</a></li>
              <li><a href="/book-a-speaker" className="hover:underline">Book a Speaker</a></li>
              <li><a href="/admin" onClick={handleNav} className="hover:underline">Admin</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="/services#keynote" onClick={handleNav} className="hover:underline">Keynote Speakers</a></li>
              <li><a href="/services#panel" onClick={handleNav} className="hover:underline">Panel Discussions</a></li>
              <li><a href="/services#boardroom" onClick={handleNav} className="hover:underline">Boardroom Consulting</a></li>
              <li><a href="/services#workshops" onClick={handleNav} className="hover:underline">Workshop Facilitators</a></li>
              <li><a href="/services#virtual" onClick={handleNav} className="hover:underline">Virtual Events</a></li>
              <li><a href="/services#coaching" onClick={handleNav} className="hover:underline">Leadership Coaching</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Contact</h4>
            <a className="block hover:underline" href="mailto:info@africanspeakerbureau.com">
              info@africanspeakerbureau.com
            </a>
            <a className="mt-4 block hover:underline" href="/#quick-inquiry">Message us</a>
            <a className="mt-2 block hover:underline" href="/book-a-speaker">Request Consultation</a>
          </div>
        </div>
        <div className="mt-10 text-xs text-slate-400">
          © {new Date().getFullYear()} African Speaker Bureau. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

