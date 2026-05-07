'use client';

import { AlertTriangle } from 'lucide-react';
import Dialog from './Dialog';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'danger' | 'primary';
  isLoading?: boolean;
}

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'danger',
  isLoading = false,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} className="max-w-sm w-full p-6 sm:p-8" showCloseButton={false}>
      <div className="text-center">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${
          confirmVariant === 'danger' ? 'bg-red-50 text-red-500' : 'bg-saffron-glow/10 text-saffron-glow'
        }`}>
          <AlertTriangle size={24} />
        </div>
        <h3 className="text-lg font-semibold text-deep-ink font-headline mb-2">{title}</h3>
        <p className="text-sm text-deep-ink/50 font-body mb-6 leading-relaxed">{description}</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 inline-flex items-center justify-center px-5 py-3 rounded-xl border border-deep-ink/10 text-deep-ink font-body font-medium text-sm transition-all duration-200 hover:bg-deep-ink/5 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 inline-flex items-center justify-center px-5 py-3 rounded-xl font-body font-semibold text-sm text-white transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 ${
              confirmVariant === 'danger'
                ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/25'
                : 'btn-primary'
            }`}
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
