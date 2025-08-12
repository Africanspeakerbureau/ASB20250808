import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu } from "lucide-react"; // hamburger icon
import { MAIN_LINKS } from "@/lib/navLinks";
import MobileMenu from "@/components/MobileMenu.jsx";

export default function Header({ countryCode, currency }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header
        className="bg-white shadow-sm border-b sticky top-0 z-50"
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

            {/* Geo/currency chip (wired in Patch 2) + mobile button */}
            <div className="flex items-center gap-3">
              {countryCode && currency && (
                <div className="hidden md:flex items-center gap-1 text-sm text-gray-700">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                    <path d="M2 12h20" />
                  </svg>
                  <span className="font-medium">{countryCode}</span>
                  <span className="text-blue-600 font-semibold">{currency}</span>
                </div>
              )}
              <button
                className="lg:hidden p-2 rounded hover:bg-blue-50 text-blue-900"
                aria-label="Open menu"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* stays mounted but hidden unless open */}
      <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}
