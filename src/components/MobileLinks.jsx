import React from 'react';
import { NavLink } from 'react-router-dom';

const LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Find a Speaker', to: '/speakers' },
  { label: 'Services', to: '/services' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export default function MobileLinks({ onNavigate }) {
  return (
    <ul className="space-y-4">
      {LINKS.map((item) => (
        <li key={item.to}>
          <NavLink
            to={item.to}
            className="block"
            onClick={() => {
              onNavigate?.();
            }}
          >
            {item.label}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}
