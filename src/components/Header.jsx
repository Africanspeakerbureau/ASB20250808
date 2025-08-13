"use client";

import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { MAIN_LINKS } from "@/lib/navLinks";

/** Lightweight icons so we don't add deps */
function MenuIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      width="24"
      height="24"
      aria-hidden="true"
    >
      <path
        d="M3 6h18M3 12h18M3 18h18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      width="24"
      height="24"
      aria-hidden="true"
    >
      <path
        d="M6 6l12 12M18 6l-12 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Header({ countryCode, currency }) {
  const [open, setOpen] = useState(false);

  // Lock body scroll when menu is open
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = open ? "hidden" : original || "";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  return (
    <header
      className="bg-white shadow-sm border-b sticky top-0 z-[200] pointer-events-auto site-header"
      onClickCapture={(e) => e.stopPropagation()}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo -> Home */}
          <NavLink to="/" className="h-12 flex items-center">
            <div className="bg-blue-900 rounded px-3 py-2 flex items-center justify-center min-w-[50px]">
              <span className="text-white font-bold text-lg">ASB</span>
            </div>
            <div className="ml-3 text-blue-900 leading-tight">
              <span className="text-sm font-medium block">AFRICAN</span>
              <span className="text-sm font-medium block">SPEAKER</span>
              <span className="text-sm font-medium block">BUREAU</span>
            </div>
          </NavLink>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8 text-gray-900">
            {MAIN_LINKS.map(({ to, label, variant }) => (
              <NavLink
                key={to}
                to={to}
                className={
                  variant === "default"
                    ? "px-4 py-2 rounded-2xl bg-black text-white hover:bg-black/80"
                    : "hover:text-blue-700"
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Geo/currency chip + mobile button */}
          <div className="flex items-center gap-3">
            {countryCode && currency && (
              <div className="hidden md:flex items-center gap-1 text-sm text-gray-700">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                  <path d="M2 12h20" />
                </svg>
                <span className="font-medium">{countryCode}</span>
                <span className="text-blue-600 font-semibold">{currency}</span>
              </div>
            )}
            <button
              type="button"
              aria-label="Open menu"
              className="lg:hidden p-2 rounded hover:bg-blue-50 text-blue-900"
              onClick={() => setOpen(true)}
            >
              <MenuIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile sheet */}
      {open && (
        <div
          className="fixed inset-0 z-[300] bg-black/50"
          onClick={() => setOpen(false)}
        >
          <div
            className="absolute right-0 top-0 h-full w-[84%] max-w-sm bg-[#0F1A3B] text-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close menu"
              className="mb-6 p-2 -m-2 rounded-md focus:outline-none focus-visible:ring"
              onClick={() => setOpen(false)}
            >
              <CloseIcon className="h-6 w-6" />
            </button>

            <nav className="grid gap-4 text-lg">
              {MAIN_LINKS.map(({ to, label, variant }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  className={
                    variant === "default"
                      ? "mt-2 inline-flex items-center justify-center rounded-full px-4 py-2 bg-white text-[#0F1A3B] font-medium"
                      : undefined
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

