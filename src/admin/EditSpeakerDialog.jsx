import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './admin-edit.css';

export default function EditSpeakerDialog({ open, onClose, record }) {
  const ref = useRef(null);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const dialog = (
    <div
      className="asb-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Edit speaker"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="asb-modal-card" ref={ref}>
        <button className="asb-modal-close" aria-label="Close" onClick={onClose}>×</button>
        <h2 className="asb-modal-title">
          {record?.name || record?.fields?.['First Name'] || 'Edit'}
        </h2>
        <p className="asb-muted">Editor shell mounted via portal. Fields wiring comes next.</p>
      </div>
    </div>
  );

  return createPortal(dialog, document.body);
}
