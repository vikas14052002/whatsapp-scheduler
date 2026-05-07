'use client';

import { useEffect, useCallback, useState, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  showCloseButton?: boolean;
}

export default function Dialog({ open, onClose, children, className = '', showCloseButton = true }: DialogProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (open) {
      setMounted(true);
      // small delay to allow mount before adding visible class for transition
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
      document.addEventListener('keydown', handleEscape);
      const scrollY = window.scrollY;
      document.documentElement.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.documentElement.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    } else {
      setVisible(false);
      const timer = setTimeout(() => setMounted(false), 250);
      return () => clearTimeout(timer);
    }
  }, [open, handleEscape]);

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed top-0 left-0 w-screen h-screen z-[9999] flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      style={{ isolation: 'isolate' }}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-md transition-opacity duration-200 ${visible ? 'opacity-100' : 'opacity-0'}`}
        style={{ zIndex: 1 }}
        onClick={onClose}
      />
      {/* Content */}
      <div
        className={`relative bg-white rounded-3xl shadow-2xl shadow-black/20 max-h-[90vh] overflow-y-auto ${className} transition-all duration-200 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        style={{ zIndex: 2 }}
        onClick={(e) => e.stopPropagation()}
      >
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-deep-ink/30 hover:text-deep-ink hover:bg-deep-ink/5 transition-all duration-200 hover:rotate-90"
            style={{ zIndex: 3 }}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        )}
        {children}
      </div>
    </div>,
    document.body
  );
}
