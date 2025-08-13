import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { SERVICE_LINKS } from '@/lib/navLinks';

const FOOTER_HREFS = {
  about: "/about",
  contact: "/#get-in-touch",
  book: "/book-a-speaker",
  admin: "/admin",
};

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
      aria-modal="true"
      role="dialog"
      aria-label="Mobile navigation"
      className="fixed inset-0 z-[100] lg:hidden"
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <nav className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-slate-900 text-slate-100 p-6 shadow-xl">
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
        <div className="flex flex-col gap-4 text-lg">
          <a href={FOOTER_HREFS.about} onClick={onClose}>
            About
          </a>
          <a href={FOOTER_HREFS.contact} onClick={onClose}>
            Contact
          </a>
          <a href={FOOTER_HREFS.book} onClick={onClose}>
            Book a Speaker
          </a>
          <a href={FOOTER_HREFS.admin} onClick={onClose}>
            Admin
          </a>
        </div>

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
    </div>
  );
}

