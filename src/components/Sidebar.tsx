'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, CalendarDays, Scissors, Users, Settings, LogOut,
  MessageCircle, Zap, Sparkles
} from 'lucide-react';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import ThemeToggle from './ThemeToggle';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/appointments', label: 'Appointments', icon: CalendarDays },
  { href: '/dashboard/services', label: 'Services', icon: Scissors },
  { href: '/dashboard/customers', label: 'Customers', icon: Users },
  { href: '/dashboard/automation', label: 'Automation', icon: Zap },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' }),
    });
    setIsLoggingOut(false);
    setShowLogoutConfirm(false);
    router.push('/login');
  }

  return (
    <>
      <aside className="w-64 h-screen flex flex-col sticky top-0 left-0 shrink-0 z-30
        bg-white/80 dark:bg-deep-ink/80 backdrop-blur-xl
        border-r border-deep-ink/5 dark:border-white/5">

        {/* Logo */}
        <div className="p-6 border-b border-deep-ink/5 dark:border-white/5 shrink-0">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.08, rotate: -5 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-br from-saffron-glow to-coral-blush text-white p-2 rounded-xl shadow-lg shadow-saffron-glow/20"
            >
              <MessageCircle size={20} />
            </motion.div>
            <div>
              <span className="text-lg font-bold text-deep-ink dark:text-white font-display tracking-tight block leading-tight">
                BookKar
              </span>
              <span className="text-[10px] text-deep-ink/30 dark:text-white/30 font-body tracking-wide uppercase">
                WhatsApp Scheduler
              </span>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item, i) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="relative block">
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-saffron-glow/10 dark:bg-saffron-glow/15 rounded-xl border border-saffron-glow/20"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <div
                  className={`relative flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-saffron-glow'
                      : 'text-deep-ink/40 dark:text-white/40 hover:text-deep-ink dark:hover:text-white hover:bg-deep-ink/[0.03] dark:hover:bg-white/[0.03]'
                  }`}
                >
                  <motion.div
                    animate={{ scale: isActive ? 1.1 : 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  >
                    <Icon size={18} />
                  </motion.div>
                  <span>{item.label}</span>
                  {item.href === '/dashboard/automation' && (
                    <Sparkles size={12} className="text-saffron-glow/50 ml-auto" />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-deep-ink/5 dark:border-white/5 shrink-0 space-y-2">
          <div className="flex items-center gap-2 px-2">
            <ThemeToggle />
            <span className="text-xs text-deep-ink/30 dark:text-white/30 font-body">Theme</span>
          </div>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-deep-ink/30 dark:text-white/30 hover:text-red-500 hover:bg-red-50/50 dark:hover:bg-red-500/10 rounded-xl transition-all duration-200 font-body text-sm font-medium group"
          >
            <motion.div whileHover={{ rotate: 12 }} transition={{ type: 'spring', stiffness: 400 }}>
              <LogOut size={18} />
            </motion.div>
            Sign Out
          </button>
        </div>
      </aside>

      <ConfirmDialog
        open={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Sign Out?"
        description="Are you sure you want to sign out of your account?"
        confirmText="Sign Out"
        cancelText="Stay"
        confirmVariant="danger"
        isLoading={isLoggingOut}
      />
    </>
  );
}
