import { useEffect, useState, useCallback } from "react";
import { NavLink } from "react-router-dom";
import { Menu } from "lucide-react";
import { MAIN_LINKS } from "@/lib/navLinks";

export default function Header({ countryCode, currency }) {
  const [open, setOpen] = useState(false);

  // lock/unlock body scroll while menu is open
  useEffect(() => {
    if (typeof document === "undefined") return;
    const b = document.body;
    if (open) b.classList.add("body-no-scroll");
    else b.classList.remove("body-no-scroll");
    return () => b.classList.remove("body-no-scroll");
  }, [open]);

  const onKeyDown = useCallback((e) => {
    if (e.key === "Escape") setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onKeyDown]);

  return (
    <header className="sticky top-0 z-[100] bg-white/90 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* --- Left: brand --- */}
        <NavLink to="/" className="flex items-center gap-3">
          <span className="sr-only">African Speaker Bureau</span>
          <div className="bg-blue-900 rounded px-3 py-2 flex items-center justify-center min-w-[50px]">
            <span className="text-white font-bold text-lg">ASB</span>
          </div>
          <div className="ml-3 text-blue-900 leading-tight">
            <span className="text-sm font-medium block">AFRICAN</span>
            <span className="text-sm font-medium block">SPEAKER</span>
            <span className="text-sm font-medium block">BUREAU</span>
          </div>
        </NavLink>

        {/* --- Desktop nav --- */}
        <nav className="hidden lg:flex items-center gap-8">
          {MAIN_LINKS.map(({ to, label, variant }) => (
            <NavLink
              key={to}
              to={to}
              className={
                variant === "default"
                  ? "px-4 py-2 rounded-2xl bg-black text-white hover:bg-black/80"
                  : "hover:text-blue-700"
              }
              onClick={() => setOpen(false)}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* --- Right: geo chip + burger --- */}
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
            type="button"
            className="lg:hidden inline-flex items-center justify-center p-2 rounded-md"
            aria-label="Open menu"
            aria-expanded={open ? "true" : "false"}
            onClick={() => setOpen(true)}
          >
            <span className="sr-only">Open menu</span>
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* --- Mobile overlay (only on small screens) --- */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-[110]">
          {/* backdrop */}
          <button
            aria-label="Close menu"
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          {/* panel */}
          <nav
            className="absolute top-16 inset-x-3 rounded-2xl bg-white shadow-xl p-4 space-y-2"
            role="dialog"
            aria-modal="true"
          >
            {MAIN_LINKS.map(({ to, label, variant }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={
                  variant === "default"
                    ? "block py-2 rounded-lg bg-black text-white text-center"
                    : "block py-2"
                }
              >
                {label}
              </NavLink>
            ))}
            <button
              onClick={() => setOpen(false)}
              className="mt-2 w-full rounded-lg border py-2"
            >
              Close
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}

