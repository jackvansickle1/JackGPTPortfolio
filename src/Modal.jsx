import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function Modal({ className = "", label, onClose, returnFocusRef, children }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    const opener = returnFocusRef?.current || document.activeElement;
    const scrollY = window.scrollY;
    const previous = {
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
    };
    // Fixed positioning also locks the background on mobile Safari.
    Object.assign(document.body.style, { position: "fixed", top: `-${scrollY}px`, width: "100%" });
    dialog.showModal();

    const updateViewport = () => {
      const viewport = window.visualViewport;
      dialog.style.setProperty("--dialog-height", `${viewport?.height ?? window.innerHeight}px`);
      dialog.style.setProperty("--dialog-top", `${viewport?.offsetTop ?? 0}px`);
      dialog.dataset.compactViewport = String((viewport?.height ?? window.innerHeight) < 400);
    };
    updateViewport();
    window.visualViewport?.addEventListener("resize", updateViewport);
    window.visualViewport?.addEventListener("scroll", updateViewport);

    return () => {
      window.visualViewport?.removeEventListener("resize", updateViewport);
      window.visualViewport?.removeEventListener("scroll", updateViewport);
      dialog.close();
      Object.assign(document.body.style, previous);
      window.scrollTo({ top: scrollY, behavior: "instant" });
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, [returnFocusRef]);

  return createPortal(
    <dialog
      ref={dialogRef}
      className={`modal-dialog ${className}`}
      aria-label={label}
      tabIndex={-1}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const focusable = [...event.currentTarget.querySelectorAll('a[href], button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])')]
          .filter((element) => element.getClientRects().length && !element.hidden);
        const first = focusable[0];
        const last = focusable.at(-1);
        if (!first) {
          event.preventDefault();
          event.currentTarget.focus();
        } else if (event.shiftKey && (document.activeElement === first || document.activeElement === event.currentTarget)) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      {children}
    </dialog>,
    document.body,
  );
}
