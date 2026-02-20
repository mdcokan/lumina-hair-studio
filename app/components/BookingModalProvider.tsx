'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import BookingModal from './BookingModal';

type BookingModalContextValue = {
  openBookingModal: () => void;
  closeBookingModal: () => void;
};

const BookingModalContext = createContext<BookingModalContextValue | null>(null);

export function useBookingModal() {
  const ctx = useContext(BookingModalContext);
  if (!ctx) {
    throw new Error('useBookingModal must be used within BookingModalProvider');
  }
  return ctx;
}

export function BookingModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const openBookingModal = useCallback(() => setIsOpen(true), []);
  const closeBookingModal = useCallback(() => setIsOpen(false), []);

  return (
    <BookingModalContext.Provider value={{ openBookingModal, closeBookingModal }}>
      {children}
      <BookingModal isOpen={isOpen} onClose={closeBookingModal} />
    </BookingModalContext.Provider>
  );
}
