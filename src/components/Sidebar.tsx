'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, CalendarDays, Scissors, Users, Settings, LogOut, MessageCircle } from 'lucide-react';
import Tooltip from '@/components/ui/Tooltip';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/appointments', label: 'Appointments', icon: CalendarDays },
  { href: '/dashboard/services', label: 'Services', icon: Scissors },
  { href: '/dashboard/patients', label: 'Customers', icon: Users },
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
      <aside className="w-64 bg-white border-r border-deep-ink/5 h-screen flex flex-col shadow-sm shadow-deep-ink/3 sticky top-0 left-0 shrink-0">
        {/* Logo */}
        <div className="p-6 border-b border-deep-ink/5 shrink-0">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="bg-saffron-glow text-white p-1.5 rounded-lg shadow-md shadow-saffron-glow/20 transition-all duration-300 group-hover:shadow-saffron-glow/40 group-hover:scale-105">
              <MessageCircle size={18} />
            </div>
            <span className="text-lg font-bold text-deep-ink font-display tracking-tight">BookKar</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Tooltip key={item.href} text={item.label} position="right">
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-saffron-glow/10 text-saffron-glow shadow-sm'
                      : 'text-deep-ink/50 hover:text-deep-ink hover:bg-deep-ink/5'
                  }`}
                >
                  <Icon size={18} className={`transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
                  <span className="relative">
                    {item.label}
                    {isActive && <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-saffron-glow/30 rounded-full" />}
                  </span>
                </Link>
              </Tooltip>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-deep-ink/5 shrink-0">
          <Tooltip text="Sign Out" position="right">
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="flex items-center gap-3 px-4 py-3 w-full text-left text-deep-ink/40 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 font-body text-sm font-medium group"
            >
              <LogOut size={18} className="transition-transform duration-200 group-hover:rotate-12" />
              Sign Out
            </button>
          </Tooltip>
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
