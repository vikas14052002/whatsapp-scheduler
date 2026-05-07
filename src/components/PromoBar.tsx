'use client';

import { useState } from 'react';
import { X, Sparkles } from 'lucide-react';

export default function PromoBar() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="relative bg-saffron-glow text-white text-center py-2.5 px-4 text-sm font-body font-medium animate-fade-in">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
        <Sparkles size={14} className="hidden sm:inline" />
        <span className="hidden sm:inline">Launch Offer:</span>
        <span>First month FREE for Indian businesses</span>
        <span className="hidden sm:inline">• No credit card required</span>
        <button
          onClick={() => setDismissed(true)}
          className="ml-2 p-1 rounded-full hover:bg-white/20 transition-colors"
          aria-label="Dismiss"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
