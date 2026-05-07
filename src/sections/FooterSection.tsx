'use client';

import { MessageCircle } from 'lucide-react';
import { Container } from '@/design-system/primitives';
import { footerLinks } from '@/content/landing-page';

export default function FooterSection() {
  return (
    <footer className="bg-deep-ink border-t border-white/5">
      <Container className="py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-saffron-glow text-white p-1.5 rounded-lg">
                <MessageCircle size={18} />
              </div>
              <span className="text-lg font-bold text-white font-display">BookKar</span>
            </div>
            <p className="text-sm text-white/40 font-body leading-relaxed max-w-xs mb-6">
              WhatsApp-first appointment scheduling for Indian businesses.
              Built in India, for India.
            </p>
            <div className="flex items-center gap-4">
              {['Twitter', 'LinkedIn', 'Instagram'].map((social) => (
                <a key={social} href="#" className="text-white/30 hover:text-white/60 transition-colors text-sm">{social}</a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-headline font-semibold text-white/80 mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-white/30 hover:text-saffron-glow transition-colors font-body relative group">
                      {link}
                      <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-saffron-glow group-hover:w-full transition-all duration-300" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/20 font-body">© 2026 BookKar. Built with ❤️ in India.</p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-white/20 font-body">Made for 🇮🇳</span>
            <span className="text-xs text-white/20 font-body">UPI Ready</span>
            <span className="text-xs text-white/20 font-body">WhatsApp Official</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
