'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MessageCircle, Loader2, ArrowRight, Sparkles } from 'lucide-react';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<'login' | 'register'>(searchParams.get('tab') === 'register' ? 'register' : 'login');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [regName, setRegName] = useState('');
  const [regBusinessName, setRegBusinessName] = useState('');
  const [regBusinessType, setRegBusinessType] = useState('salon');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');

  useEffect(() => {
    const t = searchParams.get('tab');
    if (t === 'register') switchTab('register');
  }, [searchParams]);

  function switchTab(newTab: 'login' | 'register') {
    if (newTab === tab || isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setTab(newTab);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 200);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (data.success) router.push('/dashboard');
      else setError(data.error || 'Login failed');
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register', name: regName, businessName: regBusinessName, businessType: regBusinessType, phone: regPhone, email: regEmail, password: 'demo' }),
      });
      const data = await res.json();
      if (data.success) router.push('/dashboard');
      else setError(data.error || 'Registration failed');
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  async function handleDemoLogin() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email: 'demo@glowsalon.in', password: 'demo' }),
      });
      const data = await res.json();
      if (data.success) router.push('/dashboard');
      else setError(data.error || 'Demo login failed');
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  const inputBase = "w-full px-4 py-3.5 border rounded-xl bg-white text-deep-ink placeholder:text-deep-ink/30 transition-all duration-200";
  const inputNormal = "border-deep-ink/15 hover:border-deep-ink/25";
  const inputFocus = "focus:outline-none focus:ring-2 focus:ring-saffron-glow/25 focus:border-saffron-glow focus:shadow-[0_0_0_4px_rgba(232,93,4,0.08)]";

  const contentClass = `transition-all duration-200 ease-out ${isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`;

  return (
    <div className="min-h-screen bg-warm-paper flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230F0F12' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />

      <div className="max-w-md w-full relative z-10 animate-scale-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <button onClick={() => router.push('/')} className="inline-flex items-center gap-2.5 mb-4 group">
            <div className="bg-saffron-glow text-white p-2 rounded-xl shadow-lg shadow-saffron-glow/20 transition-all duration-300 group-hover:shadow-saffron-glow/40 group-hover:scale-110">
              <MessageCircle size={24} />
            </div>
            <span className="text-2xl font-bold text-deep-ink font-display tracking-tight">BookKar</span>
          </button>
          <p className="text-deep-ink/50 font-body text-sm">WhatsApp-first appointment scheduling for Indian businesses</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-deep-ink/5 shadow-xl shadow-deep-ink/5 p-6 sm:p-8">
          {/* Tabs */}
          <div className="flex gap-2 mb-8 p-1 bg-sage-whisper/50 rounded-xl">
            <button
              onClick={() => switchTab('login')}
              className={`flex-1 py-2.5 rounded-lg font-body font-semibold text-sm transition-all duration-300 ${
                tab === 'login'
                  ? 'bg-saffron-glow text-white shadow-lg shadow-saffron-glow/25'
                  : 'text-deep-ink/50 hover:text-deep-ink hover:bg-white/60'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => switchTab('register')}
              className={`flex-1 py-2.5 rounded-lg font-body font-semibold text-sm transition-all duration-300 ${
                tab === 'register'
                  ? 'bg-saffron-glow text-white shadow-lg shadow-saffron-glow/25'
                  : 'text-deep-ink/50 hover:text-deep-ink hover:bg-white/60'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm font-body animate-fade-in flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Form Content with Transition */}
          <div className={contentClass}>
            {tab === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="group">
                  <label className={`block text-sm font-medium mb-1.5 font-body transition-colors duration-200 ${focusedField === 'login-email' ? 'text-saffron-glow' : 'text-deep-ink/60'}`}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    onFocus={() => setFocusedField('login-email')}
                    onBlur={() => setFocusedField(null)}
                    className={`${inputBase} ${inputNormal} ${inputFocus}`}
                    placeholder="you@business.com"
                    required
                  />
                </div>
                <div className="group">
                  <label className={`block text-sm font-medium mb-1.5 font-body transition-colors duration-200 ${focusedField === 'login-password' ? 'text-saffron-glow' : 'text-deep-ink/60'}`}>
                    Password
                  </label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    onFocus={() => setFocusedField('login-password')}
                    onBlur={() => setFocusedField(null)}
                    className={`${inputBase} ${inputNormal} ${inputFocus}`}
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div className="pt-2 space-y-3">
                  <button type="submit" disabled={loading} className="btn-primary w-full inline-flex items-center justify-center gap-2 min-h-[48px]">
                    {loading && <Loader2 size={16} className="animate-spin" />}
                    <span className={loading ? 'opacity-80' : ''}>Sign In</span>
                    {!loading && <ArrowRight size={16} />}
                  </button>
                  <button type="button" onClick={handleDemoLogin} disabled={loading} className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-deep-ink/10 text-deep-ink font-body font-medium text-sm transition-all duration-200 hover:bg-sage-whisper hover:border-deep-ink/20 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0">
                    <Sparkles size={16} className="text-saffron-glow" />
                    Try Demo Account
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1.5 font-body transition-colors duration-200 ${focusedField === 'reg-name' ? 'text-saffron-glow' : 'text-deep-ink/60'}`}>Your Name</label>
                  <input type="text" value={regName} onChange={(e) => setRegName(e.target.value)} onFocus={() => setFocusedField('reg-name')} onBlur={() => setFocusedField(null)} className={`${inputBase} ${inputNormal} ${inputFocus}`} placeholder="Rahul Sharma" required />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 font-body transition-colors duration-200 ${focusedField === 'reg-business' ? 'text-saffron-glow' : 'text-deep-ink/60'}`}>Business Name</label>
                  <input type="text" value={regBusinessName} onChange={(e) => setRegBusinessName(e.target.value)} onFocus={() => setFocusedField('reg-business')} onBlur={() => setFocusedField(null)} className={`${inputBase} ${inputNormal} ${inputFocus}`} placeholder="Glow Beauty Salon" required />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 font-body transition-colors duration-200 ${focusedField === 'reg-type' ? 'text-saffron-glow' : 'text-deep-ink/60'}`}>Business Type</label>
                  <select value={regBusinessType} onChange={(e) => setRegBusinessType(e.target.value)} onFocus={() => setFocusedField('reg-type')} onBlur={() => setFocusedField(null)} className={`${inputBase} ${inputNormal} ${inputFocus} appearance-none bg-[url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")] bg-[length:1.25em] bg-[right_0.75rem_center] bg-no-repeat pr-10`}>
                    <option value="salon">Salon / Beauty Parlour</option>
                    <option value="clinic">Clinic / Hospital</option>
                    <option value="tuition">Tuition / Coaching</option>
                    <option value="consultant">Consultant</option>
                    <option value="spa">Spa / Wellness</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 font-body transition-colors duration-200 ${focusedField === 'reg-phone' ? 'text-saffron-glow' : 'text-deep-ink/60'}`}>WhatsApp Number</label>
                  <input type="tel" value={regPhone} onChange={(e) => setRegPhone(e.target.value)} onFocus={() => setFocusedField('reg-phone')} onBlur={() => setFocusedField(null)} className={`${inputBase} ${inputNormal} ${inputFocus}`} placeholder="+91 98765 43210" required />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 font-body transition-colors duration-200 ${focusedField === 'reg-email' ? 'text-saffron-glow' : 'text-deep-ink/60'}`}>Email</label>
                  <input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} onFocus={() => setFocusedField('reg-email')} onBlur={() => setFocusedField(null)} className={`${inputBase} ${inputNormal} ${inputFocus}`} placeholder="you@business.com" required />
                </div>
                <div className="pt-2">
                  <button type="submit" disabled={loading} className="btn-primary w-full inline-flex items-center justify-center gap-2 min-h-[48px]">
                    {loading && <Loader2 size={16} className="animate-spin" />}
                    <span className={loading ? 'opacity-80' : ''}>Create Account</span>
                    {!loading && <ArrowRight size={16} />}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-deep-ink/40 mt-6 font-body">
          Demo login: <strong className="text-deep-ink/60">demo@glowsalon.in</strong> / any password
        </p>
      </div>
    </div>
  );
}
