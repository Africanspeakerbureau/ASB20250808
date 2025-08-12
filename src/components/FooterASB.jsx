import React from 'react';
import { NavLink } from 'react-router-dom';

export default function FooterASB({ appActions }) {
  const handleConsult = (e) => {
    if (appActions?.openBooking) {
      e.preventDefault();
      appActions.openBooking();
    }
  };

  return (
    <footer data-footer="ASB-GOOD" className="bg-slate-900 text-slate-200">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
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

          <div>
            <h3 className="text-xl font-semibold">Quick Links</h3>
            <ul className="mt-6 space-y-3 text-slate-300">
              <li><NavLink to="/" className="hover:text-white">Home</NavLink></li>
              <li><NavLink to="/find-speakers" className="hover:text-white">Find a Speaker</NavLink></li>
              <li><NavLink to="/services" className="hover:text-white">Services</NavLink></li>
              <li><NavLink to="/about" className="hover:text-white">About</NavLink></li>
              <li><NavLink to="/#get-in-touch" className="hover:text-white">Contact</NavLink></li>
              <li><NavLink to="/book-a-speaker" className="hover:text-white">Book a Speaker</NavLink></li>
              <li><NavLink to="/admin" className="hover:text-white">Admin</NavLink></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold">Services</h3>
            <ul className="mt-6 space-y-3 text-slate-300">
              <li><NavLink to="/services#keynotes" className="hover:text-white">Keynote Speakers</NavLink></li>
              <li><NavLink to="/services#panel-discussions" className="hover:text-white">Panel Discussions</NavLink></li>
              <li><NavLink to="/services#boardroom-consulting" className="hover:text-white">Boardroom Consulting</NavLink></li>
              <li><NavLink to="/services#workshops" className="hover:text-white">Workshop Facilitators</NavLink></li>
              <li><NavLink to="/services#virtual-events" className="hover:text-white">Virtual Events</NavLink></li>
              <li><NavLink to="/services#leadership-coaching" className="hover:text-white">Leadership Coaching</NavLink></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold">Contact</h3>
            <div className="mt-6 space-y-4 text-slate-300">
              <div>
                <a className="hover:text-white" href="mailto:info@africanspeakerbureau.com">
                  info@africanspeakerbureau.com
                </a>
              </div>
              <div>
                <a className="hover:text-white underline" href="#/#quick-inquiry">
                  Message us
                </a>
              </div>
              <div>
                <a
                  className="hover:text-white underline"
                  href="#/book-a-speaker"
                  onClick={handleConsult}
                >
                  Request Consultation
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-sm text-slate-400 flex items-center justify-between">
          <span>© 2025 African Speaker Bureau. All rights reserved.</span>
          <span>{import.meta.env.VITE_BUILD_ID ?? ""}</span>
        </div>
      </div>
    </footer>
  );
}
