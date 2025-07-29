import React, { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

const Modal = React.memo(({ open, onClose, children, className = "" }) => {
  // Handle escape key press
  const handleEscape = useCallback(
    (event) => {
      if (event.key === "Escape" && open) {
        onClose();
      }
    },
    [open, onClose]
  );

  // Handle backdrop click
  const handleBackdropClick = useCallback(
    (event) => {
      if (event.target === event.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  // Handle body scroll lock
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleEscape);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, handleEscape]);

  if (!open) return null;

  const modalContent = (
    <div
      className={`fixed inset-0 flex items-center justify-center transition-all duration-200 ease-out ${
        open
          ? "visible bg-black/40 backdrop-blur-sm"
          : "invisible bg-transparent"
      } z-50`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={`relative transform transition-all duration-200 ease-out ${
          open ? "scale-100 opacity-100" : "scale-95 opacity-0"
        } ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );

  // Render modal in portal for better accessibility
  return createPortal(modalContent, document.body);
});

Modal.displayName = "Modal";

export default Modal;