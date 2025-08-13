import React from 'react';
import { NavLink } from 'react-router-dom';
import { MAIN_LINKS, SERVICE_LINKS } from '@/lib/navLinks';

export default function Footer({ appActions }) {
  const handleConsult = (e) => {
    if (appActions?.openBooking) {
      e.preventDefault();
      appActions.openBooking();
    }
  };

  return (
    <footer
      data-footer="ASB-GOOD"
      className="bg-slate-900 text-slate-200 relative z-10"
    >
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
              {MAIN_LINKS.map(({ key, to, label }) => (
                <li key={key}>
                  <NavLink to={to} className="hover:text-white">{label}</NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold">Services</h3>
            <ul className="mt-6 space-y-3 text-slate-300">
              {SERVICE_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <NavLink to={to} className="hover:text-white">{label}</NavLink>
                </li>
              ))}
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
                <NavLink
                  to={{ pathname: '/', state: { scrollTo: 'quick-inquiry' } }}
                  className="hover:text-white underline"
                >
                  Message us
                </NavLink>
              </div>
              <div>
                <a className="hover:text-white underline" href="/book" onClick={handleConsult}>
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

