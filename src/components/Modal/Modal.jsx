import { useEffect, useRef } from "react";
import styles from "./Modal.module.css";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef(null);
  const previouslyFocusedElementRef = useRef(null);

  // FIX: Escape-to-close, per standard WAI-ARIA dialog expectations.
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      // FIX: basic focus trap so Tab/Shift+Tab cycle within the modal
      // instead of escaping into the page behind it.
      if (event.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll(FOCUSABLE_SELECTOR);
        if (focusable.length === 0) {
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // FIX: move focus into the modal on open, restore it to the triggering
  // element on close.
  useEffect(() => {
    if (isOpen) {
      previouslyFocusedElementRef.current = document.activeElement;
      modalRef.current?.querySelector(FOCUSABLE_SELECTOR)?.focus();
    } else {
      previouslyFocusedElementRef.current?.focus?.();
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        ref={modalRef}
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className={styles.closeButton}
          aria-label="Close modal"
          onClick={onClose}
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal;
