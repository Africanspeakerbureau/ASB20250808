import { useEffect, useState } from 'react';
import Portal from './Portal';
import './toast.css';

export default function Toast({ open, message, duration = 1500, onClose }) {
  const [visible, setVisible] = useState(open);
  useEffect(() => setVisible(open), [open]);
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, duration);
    return () => clearTimeout(t);
  }, [visible, duration, onClose]);
  if (!visible) return null;
  return (
    <Portal>
      <div className="asb-toast">{message}</div>
    </Portal>
  );
}
