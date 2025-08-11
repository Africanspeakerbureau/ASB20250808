import React from 'react';

export default function Footer() {
  const buildVersion =
    import.meta.env.VITE_BUILD_VERSION ||
    new Date().toISOString().slice(0, 10).replace(/-/g, '');

  const handleNav = (e) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    window.history.pushState({}, '', href);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <footer className="bg-gray-900 text-white py-16 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
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
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" onClick={handleNav} className="hover:text-white">Home</a></li>
              <li><a href="/find" onClick={handleNav} className="hover:text-white">Find Speakers</a></li>
              <li><a href="/services" onClick={handleNav} className="hover:text-white">Services</a></li>
              <li><a href="/about" onClick={handleNav} className="hover:text-white">About</a></li>
              <li><a href="/#contact" onClick={handleNav} className="hover:text-white">Contact</a></li>
              <li><a href="/book" className="hover:text-white">Book a Speaker</a></li>
              <li><a href="/admin" onClick={handleNav} className="hover:text-white">Admin</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/services#keynote" onClick={handleNav} className="hover:text-white">Keynote Speakers</a></li>
              <li><a href="/services#panel" onClick={handleNav} className="hover:text-white">Panel Discussions</a></li>
              <li><a href="/services#boardroom" onClick={handleNav} className="hover:text-white">Boardroom Consulting</a></li>
              <li><a href="/services#workshops" onClick={handleNav} className="hover:text-white">Workshop Facilitators</a></li>
              <li><a href="/services#virtual" onClick={handleNav} className="hover:text-white">Virtual Events</a></li>
              <li><a href="/services#coaching" onClick={handleNav} className="hover:text-white">Leadership Coaching</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-3">Contact</h4>

            <a
              href="mailto:info@africanspeakerbureau.com"
              className="block text-gray-300 hover:text-white transition"
            >
              info@africanspeakerbureau.com
            </a>

            <div className="mt-4 space-y-2">
              <a
                href="/#quick-inquiry"
                className="block text-white hover:underline"
              >
                Message us
              </a>

              <a
                href="/book"
                className="block text-white hover:underline"
              >
                Request Consultation
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 flex justify-between items-end text-gray-400 text-sm relative">
          <p>© 2025 African Speaker Bureau. All rights reserved.</p>
          <span className="text-[12px] text-gray-500">{buildVersion}</span>
        </div>
      </div>
    </footer>
  );
}

