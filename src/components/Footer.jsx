import React from 'react';

export default function Footer() {
  const buildVersion =
    import.meta.env.VITE_BUILD_VERSION ||
    new Date().toISOString().slice(0, 10).replace(/-/g, '');

  return (
    <footer className="bg-gray-900 text-white py-16 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="h-12 flex items-center mb-6">
              <div className="bg-blue-600 rounded px-3 py-2 flex items-center justify-center min-w-[50px]">
                <span className="text-white font-bold text-lg">ASB</span>
              </div>
              <div className="ml-3">
                <span className="text-sm font-medium leading-tight block">AFRICAN</span>
                <span className="text-sm font-medium leading-tight block">SPEAKER</span>
                <span className="text-sm font-medium leading-tight block">BUREAU</span>
              </div>
            </div>
            <p className="text-gray-400">
              Connecting authentic African voices with global audiences since 2008.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/find-speakers" className="hover:text-white">Find Speakers</a></li>
              <li><a href="/about" className="hover:text-white">About</a></li>
              <li><a href="/contact" className="hover:text-white">Contact</a></li>
              <li><a href="/book" className="hover:text-white">Book a Speaker</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Keynote Speakers</li>
              <li>Panel Discussions</li>
              <li>Boardroom Consulting</li>
              <li>Workshop Facilitators</li>
              <li>Virtual Events</li>
              <li>Leadership Coaching</li>
            </ul>
          </div>
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

