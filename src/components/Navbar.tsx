'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle, Menu, X } from 'lucide-react';
import { Button } from '@/design-system/primitives';
import { navLinks } from '@/content/landing-page';

export default function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-deep-ink/90 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2">
            <div className="bg-saffron-glow text-white p-1.5 rounded-lg">
              <MessageCircle size={18} />
            </div>
            <span className="text-lg font-bold text-white font-display">BookKar</span>
          </button>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="text-sm text-white/60 hover:text-white font-body transition-colors">
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button onClick={() => router.push('/login')} className="text-sm text-white/60 hover:text-white font-body transition-colors">
              Sign In
            </button>
            <Button variant="primary" size="sm" onClick={() => router.push('/login?tab=register')}>
              Get Started
            </Button>
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-white p-2 transition-transform duration-200">
            <div className={`transition-transform duration-300 ${mobileOpen ? 'rotate-90' : 'rotate-0'}`}>
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </div>
          </button>
        </div>

        {/* Mobile menu with smooth transition */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
            mobileOpen ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'
          }`}
        >
          <div className={`border-t border-white/5 transition-opacity duration-200 ${mobileOpen ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex flex-col gap-4 pt-4">
              {navLinks.map((link) => (
                <a key={link.label} href={link.href} onClick={() => setMobileOpen(false)} className="text-white/60 hover:text-white font-body transition-colors">
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-3 pt-4 border-t border-white/5">
                <button onClick={() => { setMobileOpen(false); router.push('/login'); }} className="text-white/60 font-body text-left">
                  Sign In
                </button>
                <Button variant="primary" size="sm" onClick={() => { setMobileOpen(false); router.push('/login?tab=register'); }}>
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
