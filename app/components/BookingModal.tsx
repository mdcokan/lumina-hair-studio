'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

const BOOKING_EMBED_URL =
  'https://app.lumina-hairstudio.com/appointments?embed=1&utm_source=website&utm_medium=modal&utm_campaign=booking';
// To test fallback in dev: temporarily use e.g. 'https://invalid.example.com/appointments'
const BOOKING_FALLBACK_URL =
  'https://app.lumina-hairstudio.com/appointments?utm_source=website&utm_medium=fallback&utm_campaign=booking';
const IFRAME_LOAD_TIMEOUT_MS = 2500;

export type BookingModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [fallback, setFallback] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // ESC to close
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, handleClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  // Reset state when opening; start timeout for fallback
  useEffect(() => {
    if (!isOpen) {
      setIframeLoaded(false);
      setFallback(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }
    setIframeLoaded(false);
    setFallback(false);
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;
      setFallback(true);
    }, IFRAME_LOAD_TIMEOUT_MS);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [isOpen]);

  const onIframeLoad = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIframeLoaded(true);
  }, []);

  const onIframeError = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setFallback(true);
  }, []);

  // Focus trap: focus close button when opened; keep focus inside modal
  useEffect(() => {
    if (!isOpen || !containerRef.current) return;
    closeButtonRef.current?.focus();
    const el = containerRef.current;
    const focusables = el.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    el.addEventListener('keydown', onKeyDown);
    return () => el.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
    >
      {/* Backdrop - click to close */}
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-label="Kapat"
        onClick={handleClose}
      />
      {/* Panel */}
      <div
        ref={containerRef}
        className="relative w-full max-w-5xl h-[85vh] sm:h-[88vh] max-sm:h-[90vh] rounded-2xl overflow-hidden bg-[#181818] border border-[#D8CFC4]/15 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between shrink-0 px-4 py-3 border-b border-[#D8CFC4]/12">
          <h2 id="booking-modal-title" className="text-lg font-semibold text-[#D8CFC4]">
            Randevu Al
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={handleClose}
            className="p-2 rounded-lg text-[#CFC7BC] hover:text-[#D8CFC4] hover:bg-[#1F1F1F] transition-colors focus:outline-none focus:ring-2 focus:ring-[#D8CFC4]/50 focus:ring-offset-2 focus:ring-offset-[#181818]"
            aria-label="Randevu penceresini kapat"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="relative flex-1 min-h-0 flex flex-col">
          {fallback ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-6 p-8 text-center">
              <p className="text-[#CFC7BC] text-lg">
                Randevu ekranı burada açılamadı.
              </p>
              <a
                href={BOOKING_FALLBACK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#D8CFC4] hover:bg-[#C4B5A8] text-[#0E0E0E] px-6 py-3 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl"
              >
                Yeni sekmede aç
              </a>
            </div>
          ) : (
            <>
              {!iframeLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#1F1F1F] rounded-b-2xl">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-2 border-[#D8CFC4]/30 border-t-[#D8CFC4] rounded-full animate-spin" />
                    <p className="text-[#CFC7BC] text-sm">Randevu ekranı yükleniyor...</p>
                  </div>
                </div>
              )}
              <iframe
                src={BOOKING_EMBED_URL}
                title="Randevu al - Lumina Hair Studio"
                className="w-full h-full min-h-0 rounded-b-2xl border-0"
                onLoad={onIframeLoad}
                onError={onIframeError}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
