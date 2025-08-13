import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import MobileLinks from '@/components/MobileLinks.jsx';

export default function MobileMenu({ open, onClose }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      data-testid="mobile-menu"
      className="fixed inset-0 z-[200] lg:hidden"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel (dark) */}
      <aside
        className="absolute left-0 top-0 h-full w-[84%] max-w-xs bg-slate-900 text-white shadow-2xl outline-none pointer-events-auto"
      >
        <div className="flex items-center justify-between px-5 h-14 border-b border-white/10">
          <span className="text-lg font-semibold">Menu</span>
          <button
            aria-label="Close menu"
            onClick={onClose}
            className="rounded-md p-2 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40"
          >
            ✕
          </button>
        </div>

        <nav className="px-5 py-6 space-y-6 text-lg">
          {/* Links */}
          <MobileLinks onNavigate={onClose} />

          {/* Primary CTA */}
          <NavLink
            to="/book"
            className="block rounded-xl bg-black text-white text-center py-3 font-medium"
            onClick={onClose}
          >
            Book a Speaker
          </NavLink>

          {/* Admin */}
          <NavLink to="/admin" className="block" onClick={onClose}>
            Admin
          </NavLink>
        </nav>
      </aside>
    </div>
  );
}
