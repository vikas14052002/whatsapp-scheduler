'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Copy, CheckCircle, MessageCircle, X } from 'lucide-react';
import { Business } from '@/types';

export default function SettingsPage() {
  const router = useRouter();
  const [business, setBusiness] = useState<Business | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => { fetchBusiness(); }, []);

  async function fetchBusiness() {
    try {
      const res = await fetch('/api/auth');
      if (res.status === 401) { router.push('/login'); return; }
      const data = await res.json();
      if (data.business) setBusiness(data.business);
    } catch { router.push('/login'); }
  }

  function copyWebhookUrl() {
    const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/api/whatsapp/webhook`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const inputClass = "w-full px-4 py-3 border border-deep-ink/15 rounded-xl bg-white text-deep-ink placeholder:text-deep-ink/30 transition-all duration-200 hover:border-deep-ink/25 focus:outline-none focus:ring-2 focus:ring-saffron-glow/25 focus:border-saffron-glow focus:shadow-[0_0_0_4px_rgba(232,93,4,0.08)]";

  if (!business) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <div className="animate-spin rounded-full h-10 w-10 border-2 border-saffron-glow border-t-transparent" />
      <p className="text-sm text-deep-ink/40 dark:text-white/40 font-body">Loading settings...</p>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-deep-ink font-display">Settings</h1>
        <p className="text-deep-ink/40 font-body text-sm mt-0.5">Manage your business and WhatsApp integration</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="dashboard-card">
          <h2 className="text-lg font-semibold text-deep-ink font-headline mb-5">Business Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="label">Business Name</label>
              <input type="text" defaultValue={business.name} className={inputClass} />
            </div>
            <div>
              <label className="label">Business Type</label>
              <select defaultValue={business.type} className={`${inputClass} appearance-none bg-[url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")] bg-[length:1.25em] bg-[right_0.75rem_center] bg-no-repeat pr-10`}>
                <option value="salon">Salon / Beauty Parlour</option>
                <option value="clinic">Clinic / Hospital</option>
                <option value="tuition">Tuition / Coaching</option>
                <option value="consultant">Consultant</option>
                <option value="spa">Spa / Wellness</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="label">Phone</label>
              <input type="tel" defaultValue={business.phone} className={inputClass} />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" defaultValue={business.email} className={inputClass} />
            </div>
            <div>
              <label className="label">Address</label>
              <textarea defaultValue={business.address} className={inputClass} rows={2} />
            </div>
            <button className="btn-primary text-sm px-6 py-3">Save Changes</button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="dashboard-card bg-saffron-glow/5 border-saffron-glow/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-whatsapp/10 text-whatsapp">
                <MessageCircle size={20} />
              </div>
              <h2 className="text-lg font-semibold text-deep-ink font-headline">WhatsApp Integration</h2>
            </div>
            <p className="text-sm text-deep-ink/50 font-body mb-4 leading-relaxed">
              Connect your WhatsApp Business API to enable automated booking.
            </p>
            <div className="space-y-4">
              <div>
                <label className="label">WhatsApp Number</label>
                <input type="tel" defaultValue={business.whatsapp_number} className={inputClass} />
              </div>
              <div>
                <label className="label">Webhook URL</label>
                <div className="flex gap-2">
                  <input
                    type="text" readOnly
                    value={`${typeof window !== 'undefined' ? window.location.origin : ''}/api/whatsapp/webhook`}
                    className={`${inputClass} bg-sage-whisper/50 text-deep-ink/50 text-sm`}
                  />
                  <button onClick={copyWebhookUrl} className="action-btn bg-white border border-deep-ink/10 text-deep-ink/60 hover:text-saffron-glow hover:border-saffron-glow/30 shadow-sm">
                    {copied ? <CheckCircle size={16} className="text-whatsapp" /> : <Copy size={16} />}
                  </button>
                </div>
                <p className="text-xs text-deep-ink/30 mt-2 font-body">
                  Copy this URL and paste it in your Twilio/WhatsApp Business API dashboard.
                </p>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <h2 className="text-lg font-semibold text-deep-ink font-headline mb-4">Demo Mode</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <p className="text-sm text-yellow-800 font-body leading-relaxed">
                <strong>Demo Mode is ON.</strong> WhatsApp messages are logged to the console instead of being sent.
                Set <code className="bg-yellow-100 px-1.5 py-0.5 rounded font-mono text-xs">DEMO_MODE=false</code> and add your Twilio credentials in <code className="bg-yellow-100 px-1.5 py-0.5 rounded font-mono text-xs">.env.local</code> to go live.
              </p>
            </div>
          </div>

          <div className="dashboard-card">
            <h2 className="text-lg font-semibold text-deep-ink font-headline mb-4">Razorpay Payments</h2>
            <div className="space-y-4">
              <div>
                <label className="label">Razorpay Key ID</label>
                <input type="text" placeholder="rzp_test_..." className={inputClass} />
              </div>
              <div>
                <label className="label">Razorpay Key Secret</label>
                <input type="password" placeholder="••••••••" className={inputClass} />
              </div>
              <p className="text-xs text-deep-ink/30 font-body">
                Add your Razorpay test/live keys to enable UPI deposit collection.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
