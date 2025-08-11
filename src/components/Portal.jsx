import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function Portal({ children }) {
  const elRef = useRef(null);
  if (!elRef.current) {
    const el = document.createElement('div');
    el.setAttribute('data-portal-root', 'true');
    elRef.current = el;
  }
  useEffect(() => {
    document.body.appendChild(elRef.current);
    return () => {
      try {
        document.body.removeChild(elRef.current);
      } catch {
        // ignore if already removed
      }
    };
  }, []);
  return createPortal(children, elRef.current);
}
