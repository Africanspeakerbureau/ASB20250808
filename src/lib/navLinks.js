export const MAIN_LINKS = [
  { key: 'home', to: '/', label: 'Home', variant: 'ghost' },
  { key: 'find', to: '/find-speakers', label: 'Find a Speaker', variant: 'ghost' },
  { key: 'services', to: '/services', label: 'Services', variant: 'ghost' },
  { key: 'about', to: { pathname: '/', state: { scrollTo: 'about' } }, label: 'About', variant: 'ghost' },
  { key: 'contact', to: { pathname: '/', state: { scrollTo: 'contact' } }, label: 'Contact', variant: 'ghost' },
  { key: 'book', to: '/book', label: 'Book a Speaker', variant: 'default' },
  { key: 'admin', to: '/admin', label: 'Admin', variant: 'ghost' }
];

export const SERVICE_LINKS = [
  { to: '/services#keynotes', label: 'Keynote Speakers' },
  { to: '/services#panel-discussions', label: 'Panel Discussions' },
  { to: '/services#boardroom-consulting', label: 'Boardroom Consulting' },
  { to: '/services#workshops', label: 'Workshop Facilitators' },
  { to: '/services#virtual-events', label: 'Virtual Events' },
  { to: '/services#leadership-coaching', label: 'Leadership Coaching' }
];
