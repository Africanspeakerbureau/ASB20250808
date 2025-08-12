import { NavLink } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto py-8 grid gap-3 text-sm">
        <nav className="flex flex-wrap gap-4">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/find-speakers">Find a Speaker</NavLink>
          <NavLink to="/services">Services</NavLink>{/* <- FIXED */}
          <NavLink to="/about">About</NavLink>
          <NavLink to="/#get-in-touch">Contact</NavLink>
          <NavLink to="/book-a-speaker">Book a Speaker</NavLink>
          <NavLink to="/admin">Admin</NavLink>
        </nav>

        {/* Services sublinks (leave as-is if you haven’t added anchors yet) */}
        <nav className="flex flex-wrap gap-4 opacity-80">
          <NavLink to="/services#keynotes">Keynote Speakers</NavLink>
          <NavLink to="/services#panel-discussions">Panel Discussions</NavLink>
          <NavLink to="/services#boardroom-consulting">Boardroom Consulting</NavLink>
          <NavLink to="/services#workshops">Workshop Facilitators</NavLink>
          <NavLink to="/services#virtual-events">Virtual Events</NavLink>
          <NavLink to="/services#leadership-coaching">Leadership Coaching</NavLink>
        </nav>
      </div>
    </footer>
  );
}

