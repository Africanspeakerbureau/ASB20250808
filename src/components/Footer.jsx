import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Footer() {
  const buildVersion =
    import.meta.env.VITE_BUILD_VERSION ||
    new Date().toISOString().slice(0, 10).replace(/-/g, '');

  return (
    <footer className="bg-gray-900 text-white py-16 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand blurb */}
          <div>
            <h4 className="font-semibold mb-4">African Speaker Bureau</h4>
            <p className="text-gray-400">
              Connecting authentic African voices with global audiences since 2008.
            </p>
          </div>

          {/* Quick Links — EXACTLY mirrors header targets */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><NavLink to="/" className="hover:text-white">Home</NavLink></li>
              <li><NavLink to="/find-speakers" className="hover:text-white">Find a Speaker</NavLink></li>
              <li><NavLink to="/services" className="hover:text-white">Services</NavLink></li>
              <li><NavLink to="/about" className="hover:text-white">About</NavLink></li>
              <li><NavLink to="/#get-in-touch" className="hover:text-white">Contact</NavLink></li>
              <li><NavLink to="/book-a-speaker" className="hover:text-white">Book a Speaker</NavLink></li>
              <li><NavLink to="/admin" className="hover:text-white">Admin</NavLink></li>
            </ul>
          </div>

          {/* Services sub-links (optional anchors) */}
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400">
              <li><NavLink to="/services#keynote" className="hover:text-white">Keynote Speakers</NavLink></li>
              <li><NavLink to="/services#panel" className="hover:text-white">Panel Discussions</NavLink></li>
              <li><NavLink to="/services#boardroom" className="hover:text-white">Boardroom Consulting</NavLink></li>
              <li><NavLink to="/services#workshops" className="hover:text-white">Workshop Facilitators</NavLink></li>
              <li><NavLink to="/services#virtual" className="hover:text-white">Virtual Events</NavLink></li>
              <li><NavLink to="/services#coaching" className="hover:text-white">Leadership Coaching</NavLink></li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>+1 (555) 123-4567</li>
              <li>info@africanspeakerbureau.com</li>
              <li>New York • London • Lagos •</li>
              <li>Cape Town</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex justify-between items-end text-gray-400 text-sm relative">
          <p>© 2025 African Speaker Bureau. All rights reserved.</p>
          <span className="text-[12px] text-gray-500">{buildVersion}</span>
        </div>
      </div>
    </footer>
  );
}
