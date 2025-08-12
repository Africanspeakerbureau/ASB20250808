import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';

export default function MobileMenu({ open, onClose }) {
  // lock scroll when menu open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      aria-modal="true"
      role="dialog"
      aria-label="Mobile navigation"
      data-mobile-menu
      id="mobile-menu"
      className="fixed inset-0 z-[80] lg:hidden"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Panel */}
      <nav
        className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-slate-900 text-slate-100 p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}        // don’t close when tapping inside
      >
        <div className="flex items-center justify-between mb-6">
          <span className="text-lg font-semibold">Menu</span>
          <button
            aria-label="Close menu"
            onClick={onClose}
            className="p-2 rounded hover:bg-white/10"
          >✕</button>
        </div>

        <ul className="space-y-4 text-base">
          <li><NavLink to="/" onClick={onClose}>Home</NavLink></li>
          <li><NavLink to="/find-speakers" onClick={onClose}>Find a Speaker</NavLink></li>
          <li><NavLink to="/services" onClick={onClose}>Services</NavLink></li>
          <li><NavLink to="/about" onClick={onClose}>About</NavLink></li>
          <li><NavLink to="/#get-in-touch" onClick={onClose}>Contact</NavLink></li>
          <li><NavLink to="/book-a-speaker" onClick={onClose}>Book a Speaker</NavLink></li>
          <li><NavLink to="/admin" onClick={onClose}>Admin</NavLink></li>
        </ul>
      </nav>
    </div>
  );
}
