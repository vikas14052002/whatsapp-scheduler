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
    const handleScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.85);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isDark = !scrolled;

  return (
    <div className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6">
      <nav
        className={`max-w-5xl mx-auto rounded-2xl border transition-all duration-500 ${
          isDark
            ? 'bg-white/[0.03] backdrop-blur-2xl border-white/[0.08] shadow-lg shadow-black/30'
            : 'bg-white/70 backdrop-blur-2xl border-deep-ink/5 shadow-lg shadow-deep-ink/5'
        }`}
        style={
          isDark
            ? {
                background:
                  'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
              }
            : undefined
        }
      >
        {/* Inner top highlight line for liquid glass effect */}
        {isDark && (
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-t-2xl pointer-events-none" />
        )}

        <div className="flex items-center justify-between h-14 px-5">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 group"
          >
            <div className="bg-saffron-glow text-white p-1.5 rounded-lg transition-transform duration-300 group-hover:scale-110">
              <MessageCircle size={16} />
            </div>
            <span
              className={`text-base font-bold font-display transition-colors duration-500 ${
                isDark ? 'text-white' : 'text-deep-ink'
              }`}
            >
              BookKar
            </span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`px-4 py-2 rounded-xl text-sm font-body font-medium transition-all duration-300 ${
                  isDark
                    ? 'text-white/70 hover:text-white hover:bg-white/5'
                    : 'text-deep-ink/60 hover:text-deep-ink hover:bg-deep-ink/5'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => router.push('/login')}
              className={`px-4 py-2 rounded-xl text-sm font-body font-medium transition-all duration-300 ${
                isDark
                  ? 'text-white/70 hover:text-white hover:bg-white/5'
                  : 'text-deep-ink/60 hover:text-deep-ink hover:bg-deep-ink/5'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => router.push('/login?tab=register')}
              className="px-5 py-2.5 rounded-xl text-sm font-body font-semibold bg-saffron-glow text-white shadow-lg shadow-saffron-glow/25 hover:shadow-saffron-glow/40 hover:-translate-y-0.5 transition-all duration-300"
            >
              Get Started
            </button>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden p-2 rounded-xl transition-all duration-300 ${
              isDark
                ? 'text-white/70 hover:text-white hover:bg-white/5'
                : 'text-deep-ink/60 hover:text-deep-ink hover:bg-deep-ink/5'
            }`}
          >
            <div className={`transition-transform duration-300 ${mobileOpen ? 'rotate-90' : 'rotate-0'}`}>
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
            mobileOpen ? 'max-h-80 opacity-100 pb-5' : 'max-h-0 opacity-0'
          }`}
        >
          <div
            className={`mx-4 mb-2 border-t transition-opacity duration-200 ${
              mobileOpen ? 'opacity-100' : 'opacity-0'
            } ${isDark ? 'border-white/5' : 'border-deep-ink/5'}`}
          >
            <div className="flex flex-col gap-1 pt-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-body font-medium transition-colors ${
                    isDark
                      ? 'text-white/70 hover:text-white hover:bg-white/5'
                      : 'text-deep-ink/60 hover:text-deep-ink hover:bg-deep-ink/5'
                  }`}
                >
                  {link.label}
                </a>
              ))}
              <div
                className={`mt-2 pt-3 flex flex-col gap-2 border-t ${
                  isDark ? 'border-white/5' : 'border-deep-ink/5'
                }`}
              >
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    router.push('/login');
                  }}
                  className={`px-4 py-2.5 rounded-xl text-sm font-body font-medium text-left transition-colors ${
                    isDark
                      ? 'text-white/70 hover:text-white hover:bg-white/5'
                      : 'text-deep-ink/60 hover:text-deep-ink hover:bg-deep-ink/5'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    router.push('/login?tab=register');
                  }}
                  className="mx-4 mb-2 px-5 py-2.5 rounded-xl text-sm font-body font-semibold bg-saffron-glow text-white shadow-lg shadow-saffron-glow/25"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
