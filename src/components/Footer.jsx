import React from 'react';

export default function Footer({ appActions }) {
  return (
    <footer className="bg-slate-900 text-slate-200">
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* 4-column layout on desktop, 2 on tablet, 1 on mobile */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand / blurb */}
          <div>
            <div className="flex items-center gap-3">
              <img src="/logo-asb.svg" alt="ASB" className="h-10 w-10" />
              <div className="text-lg font-semibold leading-tight">
                AFRICAN<br/>SPEAKER<br/>BUREAU
              </div>
            </div>
            <p className="mt-6 text-slate-400">
              Connecting authentic African voices with global audiences since 2008.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold">Quick Links</h3>
            <ul className="mt-6 space-y-3 text-slate-300">
              <li><a href="#/" className="hover:text-white">Home</a></li>
              <li><a href="#/find-speakers" className="hover:text-white">Find Speakers</a></li>
              <li><a href="#/services" className="hover:text-white">Services</a></li>
              <li><a href="#/about" className="hover:text-white">About</a></li>
              <li><a href="#/contact" className="hover:text-white">Contact</a></li>
              <li><a href="#/book-a-speaker" className="hover:text-white">Book a Speaker</a></li>
              <li><a href="#/admin" className="hover:text-white">Admin</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-semibold">Services</h3>
            <ul className="mt-6 space-y-3 text-slate-300">
              <li><a href="#/services" className="hover:text-white">Keynote Speakers</a></li>
              <li><a href="#/services" className="hover:text-white">Panel Discussions</a></li>
              <li><a href="#/services" className="hover:text-white">Boardroom Consulting</a></li>
              <li><a href="#/services" className="hover:text-white">Workshop Facilitators</a></li>
              <li><a href="#/services" className="hover:text-white">Virtual Events</a></li>
              <li><a href="#/services" className="hover:text-white">Leadership Coaching</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-semibold">Contact</h3>
            <div className="mt-6 space-y-4 text-slate-300">
              <div>
                <a className="hover:text-white" href="mailto:info@africanspeakerbureau.com">
                  info@africanspeakerbureau.com
                </a>
              </div>

              {/* Remove phone + city list per your request */}

              <div>
                <a className="hover:text-white underline" href="#/#quick-inquiry">
                  Message us
                </a>
              </div>
              <div>
                <a
                  className="hover:text-white underline"
                  href="#/book-a-speaker"
                  onClick={(e) => { e.preventDefault(); appActions.openBooking(); }}
                >
                  Request Consultation
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* bottom line */}
        <div className="mt-12 border-t border-white/10 pt-6 text-sm text-slate-400 flex items-center justify-between">
          <span>© 2025 African Speaker Bureau. All rights reserved.</span>
          <span>{import.meta.env.VITE_BUILD_ID ?? ""}</span>
        </div>
      </div>
    </footer>
  );
}
