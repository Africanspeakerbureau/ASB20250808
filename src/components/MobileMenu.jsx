import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { MAIN_LINKS, SERVICE_LINKS } from '@/lib/navLinks';

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
    <>
      <div className="fixed inset-0 bg-black/40 z-[99]" onClick={onClose} />
      <nav
        aria-modal="true"
        role="dialog"
        aria-label="Mobile navigation"
        className="fixed right-0 top-0 z-[100] h-full w-80 max-w-[85vw] bg-slate-900 text-slate-100 p-6 shadow-xl lg:hidden"
      >
        <div className="flex items-center justify-between mb-6">
          <span className="text-lg font-semibold">Menu</span>
          <button
            aria-label="Close menu"
            onClick={onClose}
            className="p-2 rounded hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        <ul className="space-y-4 text-base">
          {MAIN_LINKS.map(({ key, to, label, variant }) => (
            <li key={key}>
              <NavLink
                to={to}
                onClick={onClose}
                className={
                  variant === 'default'
                    ? 'inline-block px-3 py-2 rounded bg-black text-white'
                    : undefined
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="mt-8 border-t border-white/10 pt-4">
          <div className="text-sm text-slate-300 font-semibold mb-2">Services</div>
          <ul className="space-y-3 text-sm">
            {SERVICE_LINKS.map(({ to, label }) => (
              <li key={to}>
                <NavLink to={to} onClick={onClose}>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
}

