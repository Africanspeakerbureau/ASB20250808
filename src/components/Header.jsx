import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu } from 'lucide-react';
import MobileMenu from './MobileMenu.jsx';
import { MAIN_LINKS } from '../lib/navLinks.js';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header
        className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur"
        onClickCapture={(e) => e.stopPropagation()}
      >
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-3">
            <img src="/logo-asb.svg" alt="ASB" className="h-8 w-8" />
            <span className="hidden sm:inline text-slate-100 font-semibold">
              AFRICAN SPEAKER BUREAU
            </span>
          </NavLink>

          <nav className="hidden lg:flex items-center gap-6 text-slate-200">
            {MAIN_LINKS.map(({ to, label, variant }) => (
              <NavLink
                key={to}
                to={to}
                className={
                  variant === 'default'
                    ? 'px-3 py-1 rounded bg-black text-white hover:bg-black/80'
                    : undefined
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <button
            aria-label="Open menu"
            className="lg:hidden p-2 rounded hover:bg-white/10 text-white"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>
      <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}
