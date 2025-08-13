export const MAIN_LINKS = [
  { to: '/', label: 'Home', variant: 'ghost' },
  { to: '/find', label: 'Find Speakers', variant: 'ghost' },
  { to: { pathname: '/', hash: '#about' }, label: 'About', variant: 'ghost' },
  { to: { pathname: '/', hash: '#contact' }, label: 'Contact', variant: 'ghost' },
  { to: '/book', label: 'Book a Speaker', variant: 'default' },
  { to: '/admin', label: 'Admin', variant: 'ghost' }
];

export const SERVICE_LINKS = [
  { to: '/services#keynotes', label: 'Keynote Speakers' },
  { to: '/services#panel-discussions', label: 'Panel Discussions' },
  { to: '/services#boardroom-consulting', label: 'Boardroom Consulting' },
  { to: '/services#workshops', label: 'Workshop Facilitators' },
  { to: '/services#virtual-events', label: 'Virtual Events' },
  { to: '/services#leadership-coaching', label: 'Leadership Coaching' }
];
