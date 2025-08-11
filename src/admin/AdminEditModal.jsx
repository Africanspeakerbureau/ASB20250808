import { useEffect, useRef } from 'react';
import Portal from '../components/Portal';
import './admin-edit.css';

export default function AdminEditModal({ open, recordId, onClose }) {
  const ref = useRef(null);

  // Close on Esc
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Focus trap
  useEffect(() => {
    if (!open || !ref.current) return;
    const dialog = ref.current;
    const focusable = dialog.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();
    const trap = (e) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    dialog.addEventListener('keydown', trap);
    return () => dialog.removeEventListener('keydown', trap);
  }, [open]);

  if (!open) return null;
  return (
    <Portal>
      <div className="asb-overlay" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className="asb-modal"
        ref={ref}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="asb-close" aria-label="Close editor" onClick={onClose}>
          ×
        </button>
        <h2 className="asb-modal-title">Admin Editor</h2>
        <p className="asb-modal-sub">
          Record ID: <code>{recordId}</code>
        </p>
        <div className="asb-modal-body">
          <p>This is a placeholder editor. We’ll load the record and map fields next.</p>
          <button className="asb-primary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </Portal>
  );
}
