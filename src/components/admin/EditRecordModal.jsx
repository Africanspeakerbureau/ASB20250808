import { useEffect, useRef } from "react";
import Portal from "./Portal";
import "./admin-modal.css";

export default function EditRecordModal({ open, record, onClose, onSave }) {
  const dialogRef = useRef(null);

  // Lock scroll & focus trap
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const dialog = dialogRef.current;
    const focusables = dialog?.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusables?.[0];
    const last = focusables?.[focusables.length - 1];

    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
      if (e.key === "Tab" && focusables && focusables.length) {
        // trap focus
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKey);
    // initial focus
    first?.focus();

    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleOverlayClick = (e) => {
    if (e.target.getAttribute("data-overlay") === "1") onClose?.();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    onSave?.(record, payload);
  };

  return (
    <Portal>
      <div
        className="asb-overlay"
        data-overlay="1"
        onMouseDown={handleOverlayClick}
        aria-hidden="true"
      />
      <div
        className="asb-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="asb-edit-title"
        ref={dialogRef}
      >
        <div className="asb-modal-header">
          <h2 id="asb-edit-title" className="asb-modal-title">
            Edit record
          </h2>
          <button className="asb-close" aria-label="Close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Example fields – map to your record fields */}
        <form onSubmit={handleSubmit} className="asb-modal-body">
          <label className="asb-field">
            <span>First Name</span>
            <input
              name="First Name"
              defaultValue={record?.fields?.["First Name"] || ""}
            />
          </label>

          <label className="asb-field">
            <span>Last Name</span>
            <input
              name="Last Name"
              defaultValue={record?.fields?.["Last Name"] || ""}
            />
          </label>

          <label className="asb-field">
            <span>Professional Title</span>
            <input
              name="Professional Title"
              defaultValue={record?.fields?.["Professional Title"] || ""}
            />
          </label>

          {/* add any other fields you already support for editing */}

          <div className="asb-modal-footer">
            <button type="button" className="asb-btn ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="asb-btn primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </Portal>
  );
}
